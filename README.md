# DigiVault - Secure Document Management System (MERN)

DigiVault is an enterprise-grade digital vault and document management platform inspired by the Government of India's DigiLocker. Built with a full-stack architecture (**React 18 + Vite**, **Express.js**, and a localized persistent database engine), DigiVault delivers a unified single-login experience, strict role-based access control (RBAC), and verified byte-for-byte cryptographic document storage and retrieval.

---

## 🌟 Key Features

### 1. Single Unified Login System
- **One Common Portal**: Both Administrators and Standard Users log in from a single common interface without choosing a role beforehand.
- **Automatic Role Detection**: The system identifies the authenticated account and automatically redirects:
  - **Admin Account** (`Nilay` / `123`) ➔ **Admin Dashboard**
  - **User Accounts** (`Sidd` / `123`, `Harsh` / `123`, or custom registered users) ➔ **User Dashboard**

### 2. User Registration & Account Governance
- Custom account creation with User ID, custom password, and confirmation.
- New accounts automatically receive `ROLE = USER` and are hashed using **bcrypt** (salt rounds = 10).
- Automatic sync with the Admin Dashboard: new users immediately increment total registered user counts and appear in the registered users table.
- Strict protection against duplicate User IDs or unauthorized Admin registrations.

### 3. User Dashboard & Document Locker
- **Personal Locker**: Users only view, search, and manage their own documents.
- **Document Metadata**: Supports Aadhaar Card, PAN Card, Driving License, Educational Certificates, Passports, and Vehicle RCs with document numbers and descriptions.
- **Search & Filtering**: Real-time filtering by document type and query search.
- **Audit History**: Personal activity log tracking upload and download events.
- **Profile Summary**: Quick overview of account statistics and membership information.

### 4. Admin Dashboard & Privacy Enforcement
- **Platform Analytics**:
  - Total Registered Users
  - Total Documents Uploaded
  - Total Documents Downloaded
- **Registered User Directory**: User IDs, creation dates, document counts, and last activity timestamps.
- **System Audit Log**: Real-time log of registration, upload, download, and delete events.
- **Strict Privacy Isolation**: The Administrator is strictly restricted from viewing, previewing, reading, or downloading users' private files (`HTTP 403 Forbidden`).

### 5. Byte-for-Byte Document Integrity & Downloads
- **Raw Binary Storage**: Uploaded files (PDF, JPG, PNG, DOCX, XLSX) are preserved untouched on disk via Multer.
- **Authenticated Downloads**: Secure download endpoints (`GET /api/documents/:id/download`) stream original binary bytes with exact `Content-Type` and `Content-Disposition` headers.
- **Zero Corruption**: Downloaded files open seamlessly in standard PDF readers, image viewers, and office software.

---

## 🏗️ Project Architecture

```
SEC/
├── client/                     # Frontend (React 18, Vite, Lucide Icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx  # Admin Dashboard & Audit Logs
│   │   │   ├── UserPanel.jsx   # User Locker, Upload & Download
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js          # REST Client (Fetch API with JWT)
│   │   ├── App.jsx             # Unified Login & Role Routing
│   │   ├── index.css           # DigiLocker-inspired Design System
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Backend (Express.js, JWT, Multer, Bcrypt)
│   ├── config/
│   │   └── db.js               # MongoDB connector (optional hybrid)
│   ├── data/
│   │   └── db.json             # Persistent JSON Database Store
│   ├── services/
│   │   └── dbStore.js          # DB Engine, Bcrypt Auth & Audit Logger
│   ├── uploads/                # Binary Document Storage (PDF, JPG, etc.)
│   ├── server.js               # Express API & Streaming Endpoints
│   └── package.json
│
└── package.json                # Root Concurrently Scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation

1. **Install Root Dependencies**:
   ```bash
   npm install
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## 💻 Running the Application

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

### Option B: Run Services Individually
- **Backend API Server**:
  ```bash
  npm run server
  # Runs on http://localhost:5000 and 0.0.0.0:5000
  ```
- **Frontend Client**:
  ```bash
  npm run client
  # Runs with Vite --host, exposing on your local network
  ```

### 📱 Access from Other Devices (Phone, Tablet, Laptop)
Because Vite is configured with `server.host = '0.0.0.0'` and a reverse proxy for `/api`, any device connected to the same Wi-Fi / Local Network can access the application without installing anything:
1. Find your computer's local Wi-Fi IP address (e.g. `10.161.28.80` or via `ipconfig`).
2. Open your mobile or tablet browser and go to:
   ```
   http://<YOUR_LOCAL_IP>:5173/
   # Example: http://10.161.28.80:5173/
   ```
3. All login, document uploads, and byte-for-byte downloads work seamlessly from other devices.

---

## 🔑 Demo Credentials

| Role | Username / Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `Nilay` *(or `nilay@securedoc.vault`)* | `123` | Admin Dashboard, System Metrics, Audit Logs |
| **Standard User 1** | `Sidd` | `123` | Personal Document Locker (Aadhaar, License) |
| **Standard User 2** | `Harsh` | `123` | Personal Document Locker (PAN, Degree) |

---

## 🛡️ API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Authenticate user or admin, returns JWT session token
- `POST /api/auth/register` - Create custom user account (`ROLE = USER`)

### Admin Portal (Protected: `ADMIN` role)
- `GET /api/admin/dashboard` - Platform statistics, user directory, and audit logs

### User Portal (Protected: `USER` role)
- `GET /api/user/documents` - Fetch caller's private documents
- `POST /api/user/documents` - Upload document file (`multipart/form-data`) with metadata
- `DELETE /api/documents/:id` - Permanently delete caller's document
- `GET /api/user/history` - User's personal upload/download activity

### Secure Download (Owner Only)
- `GET /api/documents/:id/download` - Streams original file bytes with verified MIME type and filename
