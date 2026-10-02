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

// ======================================================
// PATH CONFIGURATION
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// ENVIRONMENT VARIABLES
// ======================================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const PORT = process.env.PORT || 5000;

// Your deployed frontend URL.
// Example:
// https://digivault.vercel.app
const FRONTEND_URL = process.env.FRONTEND_URL;

// ======================================================
// UPLOAD DIRECTORY
// ======================================================
//
// Local:
//   server/uploads
//
// Vercel:
//   /tmp/digivault-uploads
//
// IMPORTANT:
// Vercel's filesystem is temporary. This keeps your existing
// functionality working, but permanent production document
// storage should eventually be moved to Blob/S3/etc.
// ======================================================

const UPLOADS_DIR = process.env.VERCEL
  ? '/tmp/digivault-uploads'
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, {
    recursive: true
  });
}

// ======================================================
// FALLBACK PDF GENERATOR
// ======================================================

function createFallbackPdfBuffer(title, subtitle) {
  const cleanTitle = (title || 'Official Document')
    .replace(/[()]/g, '');

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
(Digitally Verified and Stored via DigiVault Cloud Storage) Tj
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
    body += String(offset).padStart(10, '0') +
      ' 00000 n \n';
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

// ======================================================
// MULTER CONFIGURATION
// ======================================================
//
// Keeping disk storage for compatibility with your
// existing dbStore.js.
//
// On Vercel the files are written to /tmp.
// For permanent storage, migrate this to Vercel Blob/S3.
// ======================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);

    const safeName =
      Date.now() +
      '_' +
      Math.random()
        .toString(36)
        .substring(2, 8) +
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

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

if (FRONTEND_URL) {
  allowedOrigins.push(FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {

      // Allow server-to-server requests / tools
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('CORS: Origin not allowed')
      );
    },

    credentials: true,

    exposedHeaders: [
      'Content-Disposition',
      'Content-Type'
    ]
  })
);

// ======================================================
// BODY PARSERS
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ======================================================
// STATIC UPLOAD ACCESS
// ======================================================
//
// This is mainly useful locally.
// Private document downloads still go through
// authenticated routes below.
// ======================================================

app.use(
  '/uploads',
  express.static(UPLOADS_DIR)
);

// ======================================================
// JWT AUTHENTICATION MIDDLEWARE
// ======================================================

const authenticateToken = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    const token =
      authHeader &&
      authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!token) {

      return res.status(401).json({
        success: false,
        message:
          'Authentication required. No token provided.'
      });

    }

    jwt.verify(
      token,
      JWT_SECRET,
      (err, decoded) => {

        if (err) {

          return res.status(403).json({
            success: false,
            message:
              'Invalid or expired session token.'
          });

        }

        req.user = decoded;

        next();

      }
    );

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: err.message
    });

  }

};

// ======================================================
// ADMIN GUARD
// ======================================================

const requireAdmin = (req, res, next) => {

  if (
    !req.user ||
    req.user.role !== 'ADMIN'
  ) {

    return res.status(403).json({
      success: false,
      message:
        'Access denied: Administrator privileges required.'
    });

  }

  next();

};

// ======================================================
// USER GUARD
// ======================================================

const requireUser = (req, res, next) => {

  if (
    !req.user ||
    req.user.role !== 'USER'
  ) {

    return res.status(403).json({
      success: false,
      message:
        'Access denied: Standard User account required.'
    });

  }

  next();

};

// ======================================================
// ROOT ROUTE
// ======================================================

app.get('/', (req, res) => {

  res.json({
    success: true,
    service: 'DigiVault API',
    status: 'online'
  });

});

// ======================================================
// 1. LOGIN
// ======================================================

app.post(
  '/api/auth/login',
  (req, res) => {

    const {
      username,
      password
    } = req.body;

    if (!username || !password) {

      return res.status(400).json({
        success: false,
        message:
          'Username and password are required.'
      });

    }

    try {

      const user =
        dbStore.findUserByUsername(
          username
        );

      if (!user) {

        return res.status(401).json({
          success: false,
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
          success: false,
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

      return res.json({

        success: true,

        token,

        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt
        }

      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: err.message
      });

    }

  }
);

// ======================================================
// 2. REGISTER
// ======================================================

app.post(
  '/api/auth/register',
  (req, res) => {

    const {
      username,
      password,
      confirmPassword
    } = req.body;

    if (!username || !password) {

      return res.status(400).json({
        success: false,
        message:
          'Username and password are required.'
      });

    }

    if (password !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message:
          'Passwords do not match.'
      });

    }

    if (password.length < 3) {

      return res.status(400).json({
        success: false,
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

      return res.status(201).json({

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

      return res.status(400).json({
        success: false,
        message: err.message
      });

    }

  }
);

// ======================================================
// 3. ADMIN DASHBOARD
// ======================================================

app.get(
  '/api/admin/dashboard',

  authenticateToken,
  requireAdmin,

  (req, res) => {

    try {

      const data =
        dbStore.getAdminDashboard();

      return res.json({
        success: true,
        ...data
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message:
          'Error retrieving dashboard analytics',
        error: err.message
      });

    }

  }
);

// ======================================================
// 4. USER DOCUMENTS
// ======================================================

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

      return res.json({
        success: true,
        documents: docs
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message:
          'Error retrieving user documents',
        error: err.message
      });

    }

  }
);

// ======================================================
// 5. UPLOAD DOCUMENT
// ======================================================

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
          success: false,
          message:
            'Document Name is required.'
        });

      }

      let fileName;
      let fileSize;
      let filePath;
      let mimeType;

      // ------------------------------------------
      // REAL UPLOADED FILE
      // ------------------------------------------

      if (file) {

        fileName =
          file.originalname;

        filePath =
          file.filename;

        mimeType =
          file.mimetype ||
          getMimeType(
            file.originalname
          );

        fileSize =
          file.size >=
          1024 * 1024

            ? (
                file.size /
                (1024 * 1024)
              ).toFixed(2) +
              ' MB'

            : (
                file.size /
                1024
              ).toFixed(1) +
              ' KB';

      }

      // ------------------------------------------
      // FALLBACK GENERATED PDF
      // ------------------------------------------

      else {

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
            pdfBuf.length /
            1024
          ).toFixed(1) +
          ' KB';

      }

      // ------------------------------------------
      // SAVE DOCUMENT METADATA
      // ------------------------------------------

      const newDoc =
        dbStore.addDocument({

          userId:
            req.user.id,

          username:
            req.user.username,

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

      return res.status(201).json({

        success: true,

        message:
          `Document '${newDoc.name}' uploaded successfully.`,

        document: newDoc

      });

    } catch (err) {

      console.error(
        'Document upload error:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          'Document upload failed',
        error: err.message
      });

    }

  }
);

// ======================================================
// DOCUMENT DOWNLOAD
// ======================================================

const handleDocumentDownload =
  (req, res) => {

    try {

      // ------------------------------------------
      // ADMIN PRIVACY PROTECTION
      // ------------------------------------------

      if (
        req.user.role === 'ADMIN'
      ) {

        return res.status(403).json({

          success: false,

          message:
            'PRIVACY RESTRICTION: The Administrator cannot open, read, preview, or download users private document contents.'

        });

      }

      // ------------------------------------------
      // FIND DOCUMENT
      // ------------------------------------------

      const doc =
        dbStore.getDocumentById(
          req.params.id
        );

      if (!doc) {

        return res.status(404).json({
          success: false,
          message:
            'Document not found.'
        });

      }

      // ------------------------------------------
      // OWNERSHIP CHECK
      // ------------------------------------------

      if (
        doc.userId !== req.user.id
      ) {

        return res.status(403).json({

          success: false,

          message:
            'ACCESS DENIED: You are not authorized to download another user\'s document.'

        });

      }

      // ------------------------------------------
      // RECORD DOWNLOAD
      // ------------------------------------------

      dbStore.recordDownload(
        doc.id,
        req.user.id
      );

      // ------------------------------------------
      // LOCATE FILE
      // ------------------------------------------

      const physicalPath =
        path.join(
          UPLOADS_DIR,
          doc.filePath
        );

      // ------------------------------------------
      // FALLBACK IF FILE IS MISSING
      // ------------------------------------------

      if (
        !fs.existsSync(
          physicalPath
        )
      ) {

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

      // ------------------------------------------
      // MIME TYPE
      // ------------------------------------------

      const mime =
        doc.mimeType ||
        getMimeType(
          doc.fileName
        ) ||
        'application/octet-stream';

      const downloadFilename =
        doc.fileName ||
        `${doc.name}.pdf`;

      // ------------------------------------------
      // RESPONSE HEADERS
      // ------------------------------------------

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

      // ------------------------------------------
      // STREAM FILE
      // ------------------------------------------

      const fileStream =
        fs.createReadStream(
          physicalPath
        );

      fileStream.on(
        'error',
        (streamErr) => {

          console.error(
            'File stream error:',
            streamErr
          );

          if (
            !res.headersSent
          ) {

            res.status(500).json({

              success: false,

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

      console.error(
        'Download error:',
        err
      );

      if (
        !res.headersSent
      ) {

        return res.status(500).json({

          success: false,

          message:
            'Download failed: ' +
            err.message

        });

      }

    }

  };

// ======================================================
// DOWNLOAD ENDPOINTS
// ======================================================

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

// ======================================================
// DELETE DOCUMENT
// ======================================================

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
          success: false,
          message:
            'Document not found.'
        });

      }

      // ------------------------------------------
      // OWNER CHECK
      // ------------------------------------------

      if (
        doc.userId !== req.user.id
      ) {

        return res.status(403).json({
          success: false,
          message:
            'You can only delete your own documents.'
        });

      }

      // ------------------------------------------
      // DELETE DB RECORD
      // ------------------------------------------

      dbStore.deleteDocument(
        doc.id,
        req.user.id
      );

      // ------------------------------------------
      // DELETE PHYSICAL FILE
      // ------------------------------------------

      try {

        const physicalPath =
          path.join(
            UPLOADS_DIR,
            doc.filePath
          );

        if (
          fs.existsSync(
            physicalPath
          )
        ) {

          fs.unlinkSync(
            physicalPath
          );

        }

      } catch (fileErr) {

        console.warn(
          'Could not delete physical file:',
          fileErr.message
        );

      }

      return res.json({

        success: true,

        message:
          `Document '${doc.name}' deleted successfully.`

      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message:
          err.message
      });

    }

  }
);

// ======================================================
// USER ACTIVITY HISTORY
// ======================================================

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

      return res.json({

        success: true,

        logs

      });

    } catch (err) {

      return res.status(500).json({

        success: false,

        message:
          'Error retrieving activity log',

        error:
          err.message

      });

    }

  }
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get(
  '/api/health',

  (req, res) => {

    return res.json({

      status: 'online',

      service:
        'DigiVault Secure Document Management API',

      environment:
        process.env.VERCEL
          ? 'vercel'
          : 'local',

      uptime:
        process.uptime()

    });

  }
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use(
  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        `Route not found: ${req.method} ${req.originalUrl}`

    });

  }
);

// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
  (err, req, res, next) => {

    console.error(
      'Unhandled server error:',
      err
    );

    if (
      err instanceof multer.MulterError
    ) {

      return res.status(400).json({

        success: false,

        message:
          `Upload error: ${err.message}`

      });

    }

    if (
      err.message &&
      err.message.startsWith('CORS:')
    ) {

      return res.status(403).json({

        success: false,

        message:
          err.message

      });

    }

    return res.status(500).json({

      success: false,

      message:
        'Internal server error',

      error:
        err.message

    });

  }
);

// ======================================================
// EXPORT APP FOR VERCEL
// ======================================================



// ======================================================
// LOCAL SERVER
// ======================================================
//
// Vercel imports the app and does NOT need app.listen().
// When running locally, Node starts the server normally.
// ======================================================

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `[DigiLocker Server] Running on port ${PORT}`
  );
});
