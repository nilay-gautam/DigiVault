import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate synchronous bcrypt hash for "123"
const SALT = bcrypt.genSaltSync(10);
const DEFAULT_HASH = bcrypt.hashSync('123', SALT);

// MIME type helper
export function getMimeType(filename) {
  if (!filename) return 'application/octet-stream';
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.csv': 'text/csv',
    '.txt': 'text/plain'
  };
  return map[ext] || 'application/octet-stream';
}

// Initial Database Seed
const initialDatabase = () => ({
  users: [
    {
      id: 'usr_admin_nilay',
      username: 'Nilay',
      email: 'nilay@securedoc.vault',
      passwordHash: DEFAULT_HASH,
      role: 'ADMIN',
      createdAt: '2026-09-15T09:00:00.000Z',
      downloadsCount: 0
    },
    {
      id: 'usr_sidd_01',
      username: 'Sidd',
      email: 'sidd@securedoc.vault',
      passwordHash: DEFAULT_HASH,
      role: 'USER',
      createdAt: '2026-09-20T10:30:00.000Z',
      downloadsCount: 3
    },
    {
      id: 'usr_harsh_02',
      username: 'Harsh',
      email: 'harsh@securedoc.vault',
      passwordHash: DEFAULT_HASH,
      role: 'USER',
      createdAt: '2026-09-22T14:15:00.000Z',
      downloadsCount: 3
    }
  ],
  documents: [
    {
      id: 'doc_sidd_1',
      userId: 'usr_sidd_01',
      owner_user_id: 'usr_sidd_01',
      username: 'Sidd',
      name: 'Aadhaar Card',
      document_name: 'Aadhaar Card',
      docType: 'Aadhaar Card',
      document_type: 'Aadhaar Card',
      description: 'Official Government of India Aadhaar Digital Document',
      docDate: '2026-09-20',
      upload_date: '2026-09-20',
      docNumber: 'XXXX-XXXX-8821',
      fileName: 'sidd_aadhaar_card.pdf',
      original_filename: 'sidd_aadhaar_card.pdf',
      fileSize: '1.42 MB',
      filePath: 'sample_aadhaar.pdf',
      file_reference: 'sample_aadhaar.pdf',
      mimeType: 'application/pdf',
      mime_type: 'application/pdf',
      downloads: 2,
      uploadedAt: '2026-09-20T10:45:00.000Z',
      created_at: '2026-09-20T10:45:00.000Z'
    },
    {
      id: 'doc_sidd_2',
      userId: 'usr_sidd_01',
      owner_user_id: 'usr_sidd_01',
      username: 'Sidd',
      name: 'Driving License',
      document_name: 'Driving License',
      docType: 'Driving License',
      document_type: 'Driving License',
      description: 'Transport Authority Motor Vehicle Driving Permit',
      docDate: '2026-09-21',
      upload_date: '2026-09-21',
      docNumber: 'DL-0420110098',
      fileName: 'sidd_driving_license.pdf',
      original_filename: 'sidd_driving_license.pdf',
      fileSize: '890 KB',
      filePath: 'sample_dl.pdf',
      file_reference: 'sample_dl.pdf',
      mimeType: 'application/pdf',
      mime_type: 'application/pdf',
      downloads: 1,
      uploadedAt: '2026-09-21T11:20:00.000Z',
      created_at: '2026-09-21T11:20:00.000Z'
    },
    {
      id: 'doc_harsh_1',
      userId: 'usr_harsh_02',
      owner_user_id: 'usr_harsh_02',
      username: 'Harsh',
      name: 'Permanent Account Number (PAN)',
      document_name: 'Permanent Account Number (PAN)',
      docType: 'PAN Card',
      document_type: 'PAN Card',
      description: 'Income Tax Department PAN Identification Card',
      docDate: '2026-09-22',
      upload_date: '2026-09-22',
      docNumber: 'ABCDE1234F',
      fileName: 'harsh_pan_card.jpg',
      original_filename: 'harsh_pan_card.jpg',
      fileSize: '620 KB',
      filePath: 'sample_pan.jpg',
      file_reference: 'sample_pan.jpg',
      mimeType: 'image/jpeg',
      mime_type: 'image/jpeg',
      downloads: 3,
      uploadedAt: '2026-09-22T14:30:00.000Z',
      created_at: '2026-09-22T14:30:00.000Z'
    },
    {
      id: 'doc_harsh_2',
      userId: 'usr_harsh_02',
      owner_user_id: 'usr_harsh_02',
      username: 'Harsh',
      name: 'B.Tech Degree Certificate',
      document_name: 'B.Tech Degree Certificate',
      docType: 'Educational Certificate',
      document_type: 'Educational Certificate',
      description: 'University Bachelor of Engineering Graduation Certificate',
      docDate: '2026-09-25',
      upload_date: '2026-09-25',
      docNumber: 'UNIV-2026-ENG-441',
      fileName: 'harsh_degree_certificate.pdf',
      original_filename: 'harsh_degree_certificate.pdf',
      fileSize: '2.15 MB',
      filePath: 'sample_degree.pdf',
      file_reference: 'sample_degree.pdf',
      mimeType: 'application/pdf',
      mime_type: 'application/pdf',
      downloads: 0,
      uploadedAt: '2026-09-25T16:00:00.000Z',
      created_at: '2026-09-25T16:00:00.000Z'
    }
  ],
  activityLogs: [
    {
      id: 'act_1',
      timestamp: '2026-09-20T10:30:00.000Z',
      userId: 'usr_sidd_01',
      username: 'Sidd',
      action: 'REGISTER',
      details: "New user account 'Sidd' registered."
    },
    {
      id: 'act_2',
      timestamp: '2026-09-20T10:45:00.000Z',
      userId: 'usr_sidd_01',
      username: 'Sidd',
      action: 'UPLOAD',
      details: "User 'Sidd' uploaded 'Aadhaar Card' (Aadhaar Card)."
    },
    {
      id: 'act_3',
      timestamp: '2026-09-21T11:20:00.000Z',
      userId: 'usr_sidd_01',
      username: 'Sidd',
      action: 'UPLOAD',
      details: "User 'Sidd' uploaded 'Driving License' (Driving License)."
    },
    {
      id: 'act_4',
      timestamp: '2026-09-22T14:15:00.000Z',
      userId: 'usr_harsh_02',
      username: 'Harsh',
      action: 'REGISTER',
      details: "New user account 'Harsh' registered."
    },
    {
      id: 'act_5',
      timestamp: '2026-09-22T14:30:00.000Z',
      userId: 'usr_harsh_02',
      username: 'Harsh',
      action: 'UPLOAD',
      details: "User 'Harsh' uploaded 'Permanent Account Number (PAN)' (PAN Card)."
    },
    {
      id: 'act_6',
      timestamp: '2026-09-23T09:12:00.000Z',
      userId: 'usr_sidd_01',
      username: 'Sidd',
      action: 'DOWNLOAD',
      details: "User 'Sidd' downloaded 'Aadhaar Card'."
    },
    {
      id: 'act_7',
      timestamp: '2026-09-24T15:40:00.000Z',
      userId: 'usr_harsh_02',
      username: 'Harsh',
      action: 'DOWNLOAD',
      details: "User 'Harsh' downloaded 'Permanent Account Number (PAN)'."
    },
    {
      id: 'act_8',
      timestamp: '2026-09-25T16:00:00.000Z',
      userId: 'usr_harsh_02',
      username: 'Harsh',
      action: 'UPLOAD',
      details: "User 'Harsh' uploaded 'B.Tech Degree Certificate' (Educational Certificate)."
    }
  ]
});

// Load database from file or initialize
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = initialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(content);
    
    // Backfill mimeType and aliases for documents if missing
    let modified = false;
    if (Array.isArray(data.documents)) {
      data.documents.forEach(doc => {
        if (!doc.mimeType) {
          doc.mimeType = getMimeType(doc.fileName);
          doc.mime_type = doc.mimeType;
          modified = true;
        }
        if (!doc.original_filename) {
          doc.original_filename = doc.fileName;
          doc.owner_user_id = doc.userId;
          doc.document_name = doc.name;
          doc.document_type = doc.docType;
          doc.file_reference = doc.filePath;
          doc.created_at = doc.uploadedAt || new Date().toISOString();
          modified = true;
        }
      });
    }
    // Ensure admin user has email
    if (Array.isArray(data.users)) {
      const admin = data.users.find(u => u.username === 'Nilay');
      if (admin && !admin.email) {
        admin.email = 'nilay@securedoc.vault';
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch (err) {
    console.error('Error reading db.json, re-initializing:', err);
    const seed = initialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const dbStore = {
  // Find User by username or email (case-insensitive)
  findUserByUsername(identifier) {
    if (!identifier) return null;
    const db = readDB();
    const clean = identifier.trim().toLowerCase();
    return db.users.find(u => 
      u.username.toLowerCase() === clean || 
      (u.email && u.email.toLowerCase() === clean)
    );
  },

  findUserById(id) {
    const db = readDB();
    return db.users.find(u => u.id === id);
  },

  // Register New User (assigned role "USER")
  createUser(username, plainPassword) {
    const db = readDB();
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      throw new Error('Username is required.');
    }

    // Check uniqueness (case-insensitive)
    if (db.users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      throw new Error(`Username '${cleanUsername}' is already taken.`);
    }

    if (cleanUsername.toLowerCase() === 'nilay' || cleanUsername.toLowerCase() === 'admin') {
      throw new Error("Admin username 'Nilay' cannot be registered.");
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(plainPassword, salt);

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      username: cleanUsername,
      user_id: cleanUsername,
      email: `${cleanUsername.toLowerCase()}@vault.securedoc.com`,
      passwordHash,
      password_hash: passwordHash,
      role: 'USER', // Automatically receives USER role
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      downloadsCount: 0
    };

    db.users.push(newUser);

    // Add activity log
    const log = {
      id: 'act_' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: newUser.id,
      username: newUser.username,
      action: 'REGISTER',
      details: `New user account '${newUser.username}' registered.`
    };
    db.activityLogs.unshift(log);

    writeDB(db);
    return newUser;
  },

  // Verify password
  verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compareSync(plainPassword, passwordHash);
  },

  // Get Admin Dashboard data (Calculated strictly from actual database!)
  getAdminDashboard() {
    const db = readDB();
    const regularUsers = db.users.filter(u => u.role === 'USER');
    
    // Total registered users
    const totalUsers = regularUsers.length;

    // Total documents uploaded
    const totalDocuments = db.documents.length;

    // Total documents downloaded
    const totalDownloads = db.documents.reduce((acc, doc) => acc + (doc.downloads || 0), 0);

    // Registered user list with statistics
    const userList = regularUsers.map(user => {
      const userDocs = db.documents.filter(d => d.userId === user.id);
      const userDownloads = userDocs.reduce((acc, d) => acc + (d.downloads || 0), 0);
      const userLogs = db.activityLogs.filter(l => l.userId === user.id);
      const lastActivity = userLogs.length > 0 ? userLogs[0].timestamp : user.createdAt;

      return {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        documentsCount: userDocs.length,
        downloadsCount: userDownloads,
        lastActivity
      };
    });

    // Recent platform activity (last 25 logs)
    const recentActivity = db.activityLogs.slice(0, 25);

    return {
      totalUsers,
      totalDocuments,
      totalDownloads,
      userList,
      recentActivity
    };
  },

  // Get user's own documents only
  getUserDocuments(userId) {
    const db = readDB();
    return db.documents.filter(d => d.userId === userId);
  },

  // Get single document by ID
  getDocumentById(docId) {
    const db = readDB();
    return db.documents.find(d => d.id === docId);
  },

  // Upload new document for a user
  addDocument({ userId, username, name, docType, description, docDate, docNumber, fileName, fileSize, filePath, mimeType }) {
    const db = readDB();
    const resolvedMime = mimeType || getMimeType(fileName);

    const newDoc = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      owner_user_id: userId,
      username,
      name: name.trim(),
      document_name: name.trim(),
      docType: docType || 'Other',
      document_type: docType || 'Other',
      description: description ? description.trim() : '',
      docDate: docDate || new Date().toISOString().split('T')[0],
      upload_date: docDate || new Date().toISOString().split('T')[0],
      docNumber: docNumber ? docNumber.trim() : '',
      fileName,
      original_filename: fileName,
      fileSize,
      filePath,
      file_reference: filePath,
      mimeType: resolvedMime,
      mime_type: resolvedMime,
      downloads: 0,
      uploadedAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    db.documents.unshift(newDoc);

    // Log upload activity
    const log = {
      id: 'act_' + Date.now(),
      timestamp: new Date().toISOString(),
      userId,
      username,
      action: 'UPLOAD',
      details: `User '${username}' uploaded '${newDoc.name}' (${newDoc.docType}).`
    };
    db.activityLogs.unshift(log);

    writeDB(db);
    return newDoc;
  },

  // Record a document download (increments downloads count on doc, user, & logs it)
  recordDownload(docId, userId) {
    const db = readDB();
    const doc = db.documents.find(d => d.id === docId);
    if (!doc) {
      throw new Error('Document not found');
    }

    if (doc.userId !== userId) {
      throw new Error('Unauthorized download request');
    }

    doc.downloads = (doc.downloads || 0) + 1;

    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.downloadsCount = (user.downloadsCount || 0) + 1;
    }

    const log = {
      id: 'act_' + Date.now(),
      timestamp: new Date().toISOString(),
      userId,
      username: doc.username,
      action: 'DOWNLOAD',
      details: `User '${doc.username}' downloaded '${doc.name}'.`
    };
    db.activityLogs.unshift(log);

    writeDB(db);
    return {
      doc,
      downloadCount: doc.downloads
    };
  },

  // Delete user's own document
  deleteDocument(docId, userId) {
    const db = readDB();
    const docIndex = db.documents.findIndex(d => d.id === docId);
    if (docIndex === -1) {
      throw new Error('Document not found');
    }

    const doc = db.documents[docIndex];
    if (doc.userId !== userId) {
      throw new Error('Unauthorized delete request');
    }

    // Try deleting physical file from uploads folder if it exists
    try {
      const UPLOADS_DIR = path.join(__dirname, '../uploads');
      const p = path.join(UPLOADS_DIR, doc.filePath);
      if (fs.existsSync(p) && !doc.filePath.startsWith('sample_')) {
        fs.unlinkSync(p);
      }
    } catch (e) {
      console.warn('Could not remove physical file:', e.message);
    }

    // Remove from array
    db.documents.splice(docIndex, 1);

    // Log deletion
    const log = {
      id: 'act_' + Date.now(),
      timestamp: new Date().toISOString(),
      userId,
      username: doc.username,
      action: 'DELETE',
      details: `User '${doc.username}' deleted document '${doc.name}'.`
    };
    db.activityLogs.unshift(log);

    writeDB(db);
    return true;
  },

  // Get user activity history
  getUserActivity(userId) {
    const db = readDB();
    return db.activityLogs.filter(l => l.userId === userId);
  }
};
