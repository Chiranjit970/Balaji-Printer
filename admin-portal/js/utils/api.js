import { AuthMock } from '../mock/auth-mock.js';

/**
 * Admin Session Manager and API Client
 * Currently uses Mock service, ready to be swapped with real fetch/axios
 */
export const AdminSession = {
  // Config
  SESSION_KEY: 'balaji_admin_session',
  TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes

  /**
   * Initialize session checking
   */
  init() {
    this.checkSessionTimeout();
    // Setup activity listeners to reset timeout
    window.addEventListener('mousemove', () => this.updateActivity());
    window.addEventListener('keypress', () => this.updateActivity());
    window.addEventListener('click', () => this.updateActivity());
  },

  /**
   * Authenticate admin user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    try {
      // Use mock service (Replace with fetch in production)
      const response = await AuthMock.login(email, password);
      
      // Store session data
      this.setSession(response.data.user, response.data.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout admin user
   */
  async logout() {
    try {
      // Use mock service (Replace with fetch in production)
      await AuthMock.logout();
    } catch (e) {
      console.warn('Logout API failed, clearing local session anyway');
    } finally {
      this.clearSession();
      window.location.href = '/admin/login'; // Adjust to actual route if needed
    }
  },

  /**
   * Set session data in localStorage
   * @param {Object} user 
   * @param {string} token 
   */
  setSession(user, token) {
    const sessionData = {
      user,
      token,
      lastActivity: Date.now()
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
  },

  /**
   * Clear session data
   */
  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  /**
   * Get current session data
   * @returns {Object|null}
   */
  getSession() {
    const data = localStorage.getItem(this.SESSION_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      this.clearSession();
      return null;
    }
  },

  /**
   * Check if admin is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const session = this.getSession();
    if (!session || !session.token) return false;
    
    // Check timeout
    if (Date.now() - session.lastActivity > this.TIMEOUT_MS) {
      this.clearSession();
      return false;
    }
    
    return true;
  },

  /**
   * Get current admin user details
   * @returns {Object|null}
   */
  getAdmin() {
    const session = this.getSession();
    return session ? session.user : null;
  },

  /**
   * Update last activity timestamp
   */
  updateActivity() {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  },

  /**
   * Check session timeout and logout if expired
   */
  checkSessionTimeout() {
    setInterval(() => {
      if (this.getSession() && !this.isAuthenticated()) {
        // Session expired
        window.location.href = '/admin/login?expired=1'; // Redirect with query param
      }
    }, 60000); // Check every minute
  }
};
