import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  docType: {
    type: String,
    enum: ['aadhar', 'pan', 'license', 'legal', 'financial', 'medical', 'other'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String
  },
  fileSize: {
    type: String,
    required: true
  },
  user: {
    type: String,
    default: 'John Doe'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  encryption: {
    type: String,
    default: 'AES-256-GCM'
  },
  hash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Document = mongoose.model('Document', documentSchema);
