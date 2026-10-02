// ==========================================
// DIGIVAULT API SERVICE
// ==========================================

// Production:
// Uses the Vercel backend URL from VITE_API_URL.
//
// Local development:
// Falls back to '/api', which can be proxied through Vite.
const API_BASE =
  import.meta.env.VITE_API_URL || '/api';


// ==========================================
// API FUNCTIONS
// ==========================================

export const api = {

  // ========================================
  // AUTH: LOGIN
  // ========================================

  async login(username, password) {

    const res = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || 'Login failed'
      );
    }

    return data;
  },


  // ========================================
  // AUTH: REGISTER
  // ========================================

  async register(
    username,
    password,
    confirmPassword
  ) {

    const res = await fetch(
      `${API_BASE}/auth/register`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          username,
          password,
          confirmPassword
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || 'Registration failed'
      );
    }

    return data;
  },


  // ========================================
  // ADMIN: DASHBOARD
  // ========================================

  async getAdminDashboard(token) {

    const res = await fetch(
      `${API_BASE}/admin/dashboard`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
        'Failed to load admin dashboard'
      );
    }

    return data;
  },


  // ========================================
  // USER: GET DOCUMENTS
  // ========================================

  async getUserDocuments(token) {

    const res = await fetch(
      `${API_BASE}/user/documents`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
        'Failed to fetch user documents'
      );
    }

    return data.documents;
  },


  // ========================================
  // USER: UPLOAD DOCUMENT
  // ========================================

  async uploadDocument(
    formData,
    token
  ) {

    const res = await fetch(
      `${API_BASE}/user/documents`,
      {
        method: 'POST',

        headers: {
          'Authorization': `Bearer ${token}`
        },

        body: formData
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || 'Upload failed'
      );
    }

    return data;
  },


  // ========================================
  // USER: DOWNLOAD DOCUMENT
  // ========================================

  async downloadDocument(
    docId,
    token
  ) {

    const res = await fetch(
      `${API_BASE}/documents/${docId}/download`,
      {
        method: 'GET',

        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {

      const data =
        await res.json().catch(
          () => ({})
        );

      throw new Error(
        data.message ||
        'Download failed'
      );
    }

    const blob =
      await res.blob();

    const disposition =
      res.headers.get(
        'Content-Disposition'
      );

    let filename = '';

    if (disposition) {

      const utf8Match =
        disposition.match(
          /filename\*=UTF-8''([^;]+)/i
        );

      if (
        utf8Match &&
        utf8Match[1]
      ) {

        filename =
          decodeURIComponent(
            utf8Match[1]
          );

      } else {

        const match =
          disposition.match(
            /filename="?([^";]+)"?/i
          );

        if (
          match &&
          match[1]
        ) {

          filename =
            decodeURIComponent(
              match[1]
            );
        }
      }
    }

    return {
      blob,
      filename
    };
  },


  // ========================================
  // USER: DELETE DOCUMENT
  // ========================================

  async deleteDocument(
    docId,
    token
  ) {

    const res = await fetch(
      `${API_BASE}/documents/${docId}`,
      {
        method: 'DELETE',

        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(
        data.message ||
        'Delete failed'
      );
    }

    return data;
  },


  // ========================================
  // USER: ACTIVITY HISTORY
  // ========================================

  async getUserHistory(token) {

    const res = await fetch(
      `${API_BASE}/user/history`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(
        data.message ||
        'Failed to fetch user history'
      );
    }

    return data.logs;
  }

};
