import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { dbStore, getMimeType } from './services/dbStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Railway provides PORT automatically
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ==========================================
// FALLBACK PDF GENERATOR
// ==========================================

function createFallbackPdfBuffer(title, subtitle) {
  const cleanTitle = (title || 'Official Document').replace(/[()]/g, '');
  const cleanSubtitle = (
    subtitle || 'DigiVault Certified Secure File'
  ).replace(/[()]/g, '');

  const content = `BT
/F1 18 Tf
50 720 Td
(${cleanTitle}) Tj
/F1 12 Tf
0 -28 Td
(${cleanSubtitle}) Tj
/F1 10 Tf
0 -22 Td
(Digitally Verified & Stored via DigiVault Cloud Storage) Tj
ET`;

  const len = Buffer.byteLength(content, 'utf8');

  let body = '%PDF-1.4\n';
  const offsets = [];

  offsets.push(Buffer.byteLength(body, 'utf8'));

  body +=
    '1 0 obj\n' +
    '<< /Type /Catalog /Pages 2 0 R >>\n' +
    'endobj\n';

  offsets.push(Buffer.byteLength(body, 'utf8'));

  body +=
    '2 0 obj\n' +
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n' +
    'endobj\n';

  offsets.push(Buffer.byteLength(body, 'utf8'));

  body +=
    '3 0 obj\n' +
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ' +
    '/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\n' +
    'endobj\n';

  offsets.push(Buffer.byteLength(body, 'utf8'));

  body +=
    '4 0 obj\n' +
    '<< /Length ' +
    len +
    ' >>\n' +
    'stream\n' +
    content +
    '\nendstream\n' +
    'endobj\n';

  offsets.push(Buffer.byteLength(body, 'utf8'));

  body +=
    '5 0 obj\n' +
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n' +
    'endobj\n';

  const xrefStart = Buffer.byteLength(body, 'utf8');

  body += 'xref\n0 6\n0000000000 65535 f \n';

  for (const offset of offsets) {
    body += String(offset).padStart(10, '0') + ' 00000 n \n';
  }

  body +=
    'trailer\n' +
    '<< /Size 6 /Root 1 0 R >>\n' +
    'startxref\n' +
    xrefStart +
    '\n' +
    '%%EOF\n';

  return Buffer.from(body, 'utf8');
}

// ==========================================
// MULTER STORAGE CONFIGURATION
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const safeName =
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 8) +
      ext;

    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use('/uploads', express.static(UPLOADS_DIR));

// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token =
    authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required. No token provided.'
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid or expired session token.'
        });
      }

      req.user = decoded;

      next();
    }
  );
};

// ==========================================
// ADMIN GUARD
// ==========================================

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message:
        'Access denied: Administrator privileges required.'
    });
  }

  next();
};

// ==========================================
// USER GUARD
// ==========================================

const requireUser = (req, res, next) => {
  if (!req.user || req.user.role !== 'USER') {
    return res.status(403).json({
      message:
        'Access denied: Standard User account required.'
    });
  }

  next();
};

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Login
app.post('/api/auth/login', (req, res) => {
  const {
    username,
    password
  } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message:
        'Username and password are required.'
    });
  }

  const user =
    dbStore.findUserByUsername(username);

  if (!user) {
    return res.status(401).json({
      message:
        'Invalid username or password.'
    });
  }

  const isValid =
    dbStore.verifyPassword(
      password,
      user.passwordHash
    );

  if (!isValid) {
    return res.status(401).json({
      message:
        'Invalid username or password.'
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

  res.json({
    success: true,
    token,

    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// ==========================================
// REGISTER NEW USER
// ==========================================

app.post('/api/auth/register', (req, res) => {
  const {
    username,
    password,
    confirmPassword
  } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message:
        'Username and password are required.'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message:
        'Passwords do not match.'
    });
  }

  if (password.length < 3) {
    return res.status(400).json({
      message:
        'Password must be at least 3 characters long.'
    });
  }

  try {
    const newUser =
      dbStore.createUser(
        username,
        password
      );

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.status(201).json({
      success: true,

      message:
        `Account '${newUser.username}' created successfully!`,

      token,

      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

// ==========================================
// 2. ADMIN PANEL ROUTES
// ==========================================

// Get Admin Dashboard Overview
app.get(
  '/api/admin/dashboard',
  authenticateToken,
  requireAdmin,
  (req, res) => {

    try {
      const data =
        dbStore.getAdminDashboard();

      res.json({
        success: true,
        ...data
      });

    } catch (err) {
      res.status(500).json({
        message:
          'Error retrieving dashboard analytics',
        error: err.message
      });
    }
  }
);

// ==========================================
// 3. USER PANEL ROUTES
// ==========================================

// Get Current User Documents
app.get(
  '/api/user/documents',
  authenticateToken,
  requireUser,
  (req, res) => {

    try {
      const docs =
        dbStore.getUserDocuments(
          req.user.id
        );

      res.json({
        success: true,
        documents: docs
      });

    } catch (err) {
      res.status(500).json({
        message:
          'Error retrieving user documents',
        error: err.message
      });
    }
  }
);

// ==========================================
// UPLOAD DOCUMENT
// ==========================================

app.post(
  '/api/user/documents',
  authenticateToken,
  requireUser,
  upload.single('file'),
  (req, res) => {

    try {
      const {
        name,
        docType,
        description,
        docDate,
        docNumber
      } = req.body;

      const file = req.file;

      if (!name) {
        return res.status(400).json({
          message:
            'Document Name is required.'
        });
      }

      let fileName;
      let fileSize;
      let filePath;
      let mimeType;

      if (file) {

        // Preserve original file
        fileName = file.originalname;

        filePath = file.filename;

        mimeType =
          file.mimetype ||
          getMimeType(file.originalname);

        fileSize =
          file.size >= 1024 * 1024
            ? (
                file.size /
                (1024 * 1024)
              ).toFixed(2) + ' MB'
            : (
                file.size /
                1024
              ).toFixed(1) + ' KB';

      } else {

        // Generate fallback PDF
        const safeBase =
          name
            .trim()
            .replace(
              /[^a-zA-Z0-9_-]/g,
              '_'
            );

        const generatedName =
          Date.now() +
          '_' +
          Math.random()
            .toString(36)
            .substring(2, 8) +
          '.pdf';

        const pdfBuf =
          createFallbackPdfBuffer(
            name,
            description ||
              docNumber ||
              'DigiVault Stored Document'
          );

        fs.writeFileSync(
          path.join(
            UPLOADS_DIR,
            generatedName
          ),
          pdfBuf
        );

        fileName =
          `${safeBase}.pdf`;

        filePath =
          generatedName;

        mimeType =
          'application/pdf';

        fileSize =
          (
            pdfBuf.length / 1024
          ).toFixed(1) + ' KB';
      }

      const newDoc =
        dbStore.addDocument({
          userId: req.user.id,
          username: req.user.username,
          name,
          docType:
            docType || 'Other',
          description,
          docDate,
          docNumber,
          fileName,
          fileSize,
          filePath,
          mimeType
        });

      res.status(201).json({
        success: true,

        message:
          `Document '${newDoc.name}' uploaded successfully.`,

        document: newDoc
      });

    } catch (err) {

      res.status(500).json({
        message:
          'Document upload failed',
        error: err.message
      });

    }
  }
);

// ==========================================
// DOCUMENT DOWNLOAD
// ==========================================

// User's Own Document Download Handler
const handleDocumentDownload = (
  req,
  res
) => {

  try {

    // Admin cannot download private documents
    if (req.user.role === 'ADMIN') {

      return res.status(403).json({
        message:
          'PRIVACY RESTRICTION: The Administrator cannot open, read, preview, or download users private document contents.'
      });
    }

    // Find document
    const doc =
      dbStore.getDocumentById(
        req.params.id
      );

    if (!doc) {

      return res.status(404).json({
        message:
          'Document not found.'
      });
    }

    // Check ownership
    if (doc.userId !== req.user.id) {

      return res.status(403).json({
        message:
          'ACCESS DENIED: You are not authorized to download another user\'s document.'
      });
    }

    // Record download
    dbStore.recordDownload(
      doc.id,
      req.user.id
    );

    // Locate physical file
    const physicalPath =
      path.join(
        UPLOADS_DIR,
        doc.filePath
      );

    // If file missing, create fallback PDF
    if (!fs.existsSync(physicalPath)) {

      const fallbackPdf =
        createFallbackPdfBuffer(
          doc.name,
          doc.fileName
        );

      fs.writeFileSync(
        physicalPath,
        fallbackPdf
      );
    }

    // Determine MIME type
    const mime =
      doc.mimeType ||
      getMimeType(doc.fileName) ||
      'application/octet-stream';

    const downloadFilename =
      doc.fileName ||
      `${doc.name}.pdf`;

    res.setHeader(
      'Content-Type',
      mime
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`
    );

    res.setHeader(
      'Access-Control-Expose-Headers',
      'Content-Disposition, Content-Type'
    );

    // Stream file
    const fileStream =
      fs.createReadStream(
        physicalPath
      );

    fileStream.on(
      'error',
      (streamErr) => {

        if (!res.headersSent) {

          res.status(500).json({
            message:
              'Error streaming file',
            error:
              streamErr.message
          });

        }

      }
    );

    fileStream.pipe(res);

  } catch (err) {

    if (!res.headersSent) {

      res.status(500).json({
        message:
          'Download failed: ' +
          err.message
      });

    }

  }
};

// ==========================================
// DOWNLOAD ENDPOINTS
// ==========================================

app.get(
  '/api/documents/:id/download',
  authenticateToken,
  handleDocumentDownload
);

app.get(
  '/documents/:id/download',
  authenticateToken,
  handleDocumentDownload
);

app.post(
  '/api/documents/:id/download',
  authenticateToken,
  handleDocumentDownload
);

app.post(
  '/documents/:id/download',
  authenticateToken,
  handleDocumentDownload
);

// ==========================================
// DELETE DOCUMENT
// ==========================================

app.delete(
  '/api/documents/:id',
  authenticateToken,
  requireUser,
  (req, res) => {

    try {

      const doc =
        dbStore.getDocumentById(
          req.params.id
        );

      if (!doc) {

        return res.status(404).json({
          message:
            'Document not found.'
        });

      }

      if (doc.userId !== req.user.id) {

        return res.status(403).json({
          message:
            'You can only delete your own documents.'
        });

      }

      dbStore.deleteDocument(
        doc.id,
        req.user.id
      );

      res.json({
        success: true,

        message:
          `Document '${doc.name}' deleted successfully.`
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message
      });

    }
  }
);

// ==========================================
// USER ACTIVITY HISTORY
// ==========================================

app.get(
  '/api/user/history',
  authenticateToken,
  requireUser,
  (req, res) => {

    try {

      const logs =
        dbStore.getUserActivity(
          req.user.id
        );

      res.json({
        success: true,
        logs
      });

    } catch (err) {

      res.status(500).json({
        message:
          'Error retrieving activity log',
        error:
          err.message
      });

    }
  }
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
  '/api/health',
  (req, res) => {

    res.json({
      status: 'online',
      service:
        'DigiLocker Secure Document Management MERN API',
      uptime:
        process.uptime()
    });

  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `[DigiLocker Server] Running on port ${PORT}`
    );

  }
);
