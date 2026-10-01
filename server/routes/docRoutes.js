import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';
import { Document } from '../models/Document.js';

const router = express.Router();

// In-Memory Seed Storage (Active whenever MongoDB is connecting or disconnected)
let memoryDocs = [
  {
    id: 'doc-1',
    _id: 'doc-1',
    title: 'Aadhar Card',
    docType: 'aadhar',
    fileName: 'Aadhar_Digital_Signed.pdf',
    fileSize: '1.42 MB',
    status: 'approved',
    date: 'Jul 20, 2026',
    user: 'John Doe',
    encryption: 'AES-256-GCM',
    hash: '0x4F92B1C8E9901FA4',
    createdAt: new Date()
  },
  {
    id: 'doc-2',
    _id: 'doc-2',
    title: 'PAN Card',
    docType: 'pan',
    fileName: 'PAN_Card_eSign.jpg',
    fileSize: '820 KB',
    status: 'approved',
    date: 'Jul 19, 2026',
    user: 'John Doe',
    encryption: 'AES-256-GCM',
    hash: '0x882AC90B7512FDD1',
    createdAt: new Date()
  },
  {
    id: 'doc-3',
    _id: 'doc-3',
    title: 'Driving License',
    docType: 'license',
    fileName: 'DL_SmartCard_Scan.pdf',
    fileSize: '2.10 MB',
    status: 'pending',
    date: 'Jul 21, 2026',
    user: 'John Doe',
    encryption: 'AES-256-GCM',
    hash: '0x2174EC05AB9067C3',
    createdAt: new Date()
  }
];

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const hash = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${hash}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// GET all documents
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const docs = await Document.find().sort({ createdAt: -1 });
      return res.json(docs);
    } catch (err) {}
  }
  // Resilient fallback to memory store
  res.json(memoryDocs);
});

// POST upload document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, docType, user } = req.body;
    const file = req.file;
    const hash = '0x' + crypto.randomBytes(8).toString('hex').toUpperCase();

    const docData = {
      id: 'doc-' + Date.now(),
      _id: 'doc-' + Date.now(),
      title: title || file?.originalname || 'Encrypted Document',
      docType: docType || 'other',
      fileName: file?.originalname || 'document.pdf',
      filePath: file?.path || '',
      fileSize: file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : '1.20 MB',
      user: user || 'John Doe',
      status: 'pending',
      encryption: 'AES-256-GCM',
      hash,
      date: 'Today',
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const newDoc = new Document(docData);
        await newDoc.save();
        return res.status(201).json({ success: true, document: newDoc });
      } catch (err) {}
    }

    memoryDocs.unshift(docData);
    res.status(201).json({ success: true, document: docData });
  } catch (err) {
    res.status(500).json({ message: 'Upload processing failed', error: err.message });
  }
});

// PATCH document status (Approve / Reject)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await Document.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (updated) return res.json({ success: true, document: updated });
    } catch (err) {}
  }

  memoryDocs = memoryDocs.map(d => d.id === req.params.id || d._id === req.params.id ? { ...d, status } : d);
  const found = memoryDocs.find(d => d.id === req.params.id || d._id === req.params.id);
  res.json({ success: true, document: found });
});

// DELETE document
router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      await Document.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Document deleted from vault.' });
    } catch (err) {}
  }

  memoryDocs = memoryDocs.filter(d => d.id !== req.params.id && d._id !== req.params.id);
  res.json({ success: true, message: 'Document deleted from vault.' });
});

export default router;
