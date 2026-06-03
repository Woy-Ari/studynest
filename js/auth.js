/* ============================================
   AUTH.JS - StudyNest
   Authentication Logic: Login, Register, Validation
   ============================================ */

/**
 * Authentication Manager
 */
class AuthManager {
  constructor() {
    this.minUsernameLength = 3;
    this.minPasswordLength = 8;
    this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/; // Min 1 uppercase, 1 lowercase, 1 number
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Validate username
   */
  validateUsername(username) {
    if (username.length < this.minUsernameLength) {
      return {
        valid: false,
        error: `Username minimal ${this.minUsernameLength} karakter`
      };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return {
        valid: false,
        error: 'Username hanya boleh huruf, angka, underscore, dan dash'
      };
    }

    // Check if username already exists
    if (this.usernameExists(username)) {
      return {
        valid: false,
        error: 'Username sudah terdaftar'
      };
    }

    return { valid: true };
  }

  /**
   * Check if username exists
   */
  usernameExists(username) {
    const users = this.getAllUsers();
    return users.some(u => u.username.toLowerCase() === username.toLowerCase());
  }

  /**
   * Check if email exists
   */
  emailExists(email) {
    const users = this.getAllUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Get all registered users (from localStorage)
   */
  getAllUsers() {
    return storage.getItem('all_users') || [];
  }

  /**
   * Save all users
   */
  saveAllUsers(users) {
    return storage.setItem('all_users', users);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length < this.minPasswordLength) {
      feedback.push(`Minimal ${this.minPasswordLength} karakter`);
      return { strength: 0, feedback, score: 'weak' };
    }

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Tambah huruf kecil');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Tambah huruf besar');

    if (/\d/.test(password)) strength++;
    else feedback.push('Tambah angka');

    if (/[!@#$%^&*]/.test(password)) strength++;
    else feedback.push('Tambah karakter khusus (!@#$%^&*)');

    if (password.length > 12) strength++;

    const scores = { 1: 'weak', 2: 'fair', 3: 'fair', 4: 'strong', 5: 'strong' };

    return {
      strength: (strength / 5) * 100,
      feedback,
      score: scores[strength] || 'weak'
    };
  }

  /**
   * Hash password (simple - untuk demo saja, bukan production)
   * TODO: Gunakan bcrypt di production
   */
  hashPassword(password) {
    return btoa(password); // Base64 encoding (NOT SECURE - DEMO ONLY)
  }

  /**
   * Verify password
   */
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  /**
   * Register user
   */
  register(formData) {
    // Validation
    const usernameValidation = this.validateUsername(formData.username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }

    if (!this.validateEmail(formData.email)) {
      return { success: false, error: 'Email tidak valid' };
    }

    if (this.emailExists(formData.email)) {
      return { success: false, error: 'Email sudah terdaftar' };
    }

    if (formData.password.length < this.minPasswordLength) {
      return { success: false, error: `Password minimal ${this.minPasswordLength} karakter` };
    }

    if (formData.password !== formData.confirmPassword) {
      return { success: false, error: 'Password tidak cocok' };
    }

    // Create new user
    const newUser = {
      id: storage.generateID(),
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: this.hashPassword(formData.password),
      kelas: formData.kelas,
      jurusan: formData.jurusan,
      avatar: this.generateAvatar(formData.name),
      joinDate: new Date().toISOString(),
      xp: 0,
      badges: []
    };

    // Save to all users list
    const users = this.getAllUsers();
    users.push(newUser);
    this.saveAllUsers(users);

    // Auto login
    storage.login(newUser);

    return {
      success: true,
      user: newUser,
      message: 'Registrasi berhasil! Selamat datang di StudyNest 🎉'
    };
  }

  /**
   * Login user
   */
  login(email, password, rememberMe = false) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Email/Username atau password salah' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, error: 'Email/Username atau password salah' };
    }

    // Remove password sebelum save
    const userToStore = { ...user };
    delete userToStore.password;

    storage.login(userToStore);

    if (rememberMe) {
      localStorage.setItem('studynest_rememberMe', JSON.stringify({
        email: user.email,
        timestamp: new Date().toISOString()
      }));
    }

    return {
      success: true,
      user: userToStore,
      message: `Selamat datang kembali, ${user.name}!`
    };
  }

  /**
   * Logout user
   */
  logout() {
    storage.logout();
    localStorage.removeItem('studynest_rememberMe');
    return { success: true, message: 'Logout berhasil' };
  }

  /**
   * Check if logged in
   */
  isLoggedIn() {
    return storage.isLoggedIn();
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return storage.getUser();
  }

  /**
   * Update user profile
   */
  updateProfile(userId, updates) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      delete users[userIndex].password; // Don't update password here
      this.saveAllUsers(users);
      storage.setUser(users[userIndex]);
      return { success: true, user: users[userIndex] };
    }

    return { success: false, error: 'User tidak ditemukan' };
  }

  /**
   * Change password
   */
  changePassword(userId, oldPassword, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Password baru tidak cocok' };
    }

    if (newPassword.length < this.minPasswordLength) {
      return { success: false, error: `Password minimal ${this.minPasswordLength} karakter` };
    }

    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      const user = users[userIndex];

      if (!this.verifyPassword(oldPassword, user.password)) {
        return { success: false, error: 'Password lama salah' };
      }

      users[userIndex].password = this.hashPassword(newPassword);
      this.saveAllUsers(users);

      return { success: true, message: 'Password berhasil diubah' };
    }

    return { success: false, error: 'User tidak ditemukan' };
  }

  /**
   * Generate avatar dari nama
   */
  generateAvatar(name) {
    const avatars = ['👤', '👨', '👩', '🧑', '👶', '👴', '👵'];
    const index = name.charCodeAt(0) % avatars.length;
    return avatars[index];
  }

  /**
   * Check remember me
   */
  checkRememberMe() {
    const rememberMe = localStorage.getItem('studynest_rememberMe');
    if (rememberMe) {
      try {
        const data = JSON.parse(rememberMe);
        return data.email;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Require authentication - redirect if not logged in
   */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
}

// Create global instance
const auth = new AuthManager();

// Initialize sample users untuk demo (jika belum ada)
function initializeSampleUsers() {
  if (auth.getAllUsers().length === 0) {
    const sampleUsers = [
      {
        id: storage.generateID(),
        name: 'Budi Santoso',
        username: 'budi_santoso',
        email: 'budi@example.com',
        password: auth.hashPassword('Budi123456'),
        kelas: 'XI',
        jurusan: 'IPA',
        avatar: '👨',
        joinDate: new Date().toISOString(),
        xp: 150,
        badges: []
      },
      {
        id: storage.generateID(),
        name: 'Siti Nurhaliza',
        username: 'siti_nur',
        email: 'siti@example.com',
        password: auth.hashPassword('Siti123456'),
        kelas: 'XII',
        jurusan: 'IPS',
        avatar: '👩',
        joinDate: new Date().toISOString(),
        xp: 250,
        badges: []
      }
    ];
    auth.saveAllUsers(sampleUsers);
  }
}

// Auto-initialize pada page load
document.addEventListener('DOMContentLoaded', initializeSampleUsers);
