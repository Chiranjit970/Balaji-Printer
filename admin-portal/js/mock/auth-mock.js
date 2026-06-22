/**
 * Mock Authentication Service
 * Simulates Laravel backend behavior including rate limiting and lockout
 */

// In-memory or localStorage DB for mock state
const MOCK_DB_KEY = 'balaji_admin_mock_db';

const getMockDb = () => {
  const db = localStorage.getItem(MOCK_DB_KEY);
  if (db) return JSON.parse(db);
  return {
    failedAttempts: {}, // { 'email': { count: 0, lockedUntil: null } }
  };
};

const saveMockDb = (db) => {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
};

export const AuthMock = {
  // Default admin credentials
  VALID_EMAIL: 'admin@balajiprinters.com',
  VALID_PASSWORD: 'Admin@123',
  
  // Settings
  DELAY_MS: 800,
  MAX_ATTEMPTS: 5,
  LOCKOUT_MS: 15 * 60 * 1000, // 15 minutes

  /**
   * Simulate API delay
   */
  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.DELAY_MS));
  },

  /**
   * Login endpoint mock
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    await this.delay();

    const db = getMockDb();
    const attemptsInfo = db.failedAttempts[email] || { count: 0, lockedUntil: null };

    // Check lockout
    if (attemptsInfo.lockedUntil && Date.now() < attemptsInfo.lockedUntil) {
      const remainingMs = attemptsInfo.lockedUntil - Date.now();
      const remainingMins = Math.ceil(remainingMs / 60000);
      throw {
        status: 429,
        type: 'account_locked',
        message: `This account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMins} minutes.`
      };
    }

    // Validate credentials
    if (email === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
      // Success! Clear attempts
      db.failedAttempts[email] = { count: 0, lockedUntil: null };
      saveMockDb(db);

      // Return mock Laravel response
      return {
        status: 200,
        data: {
          token: `mock_admin_token_${Date.now()}`,
          user: {
            id: 1,
            name: 'Balaji Admin',
            email: this.VALID_EMAIL,
            role: 'super_admin'
          }
        }
      };
    }

    // Failed login
    attemptsInfo.count += 1;
    
    if (attemptsInfo.count >= this.MAX_ATTEMPTS) {
      attemptsInfo.lockedUntil = Date.now() + this.LOCKOUT_MS;
      db.failedAttempts[email] = attemptsInfo;
      saveMockDb(db);
      
      throw {
        status: 429,
        type: 'account_locked',
        message: `This account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.`
      };
    } else {
      db.failedAttempts[email] = attemptsInfo;
      saveMockDb(db);

      throw {
        status: 401,
        type: 'invalid_credentials',
        message: 'Invalid email or password. Please try again.'
      };
    }
  },

  /**
   * Logout endpoint mock
   */
  async logout() {
    await this.delay();
    return { status: 200, message: 'Logged out successfully' };
  }
};
