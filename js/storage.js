/* ============================================
   STORAGE.JS - StudyNest
   LocalStorage Handler & Data Management
   ============================================ */

/**
 * Storage Manager untuk StudyNest
 * Mengelola semua data yang disimpan di localStorage
 */

class StorageManager {
  constructor() {
    this.prefix = 'studynest_';
    this.keys = {
      user: 'user',
      todos: 'todos',
      notes: 'notes',
      session: 'session',
      streak: 'streak',
      theme: 'theme',
      pomodoro: 'pomodoro',
      badges: 'badges'
    };
  }

  /**
   * Generate unique ID
   */
  generateID() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get item dari localStorage
   */
  getItem(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Set item ke localStorage
   */
  setItem(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      this.showStorageError();
      return false;
    }
  }

  /**
   * Remove item dari localStorage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear semua data StudyNest dari localStorage
   */
  clearAll() {
    try {
      for (const key in this.keys) {
        this.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Cek apakah sudah login
   */
  isLoggedIn() {
    return this.getItem(this.keys.session) === true;
  }

  /**
   * Get current user data
   */
  getUser() {
    return this.getItem(this.keys.user);
  }

  /**
   * Set user data (saat register/login)
   */
  setUser(userData) {
    return this.setItem(this.keys.user, userData);
  }

  /**
   * Update user profile
   */
  updateUser(updates) {
    const user = this.getUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      return this.setUser(updatedUser);
    }
    return false;
  }

  /**
   * Login - set session
   */
  login(user) {
    this.setUser(user);
    this.setItem(this.keys.session, true);
    this.updateStreak(); // Update streak saat login
    return true;
  }

  /**
   * Logout - clear session
   */
  logout() {
    this.removeItem(this.keys.session);
    this.removeItem(this.keys.user);
    return true;
  }

  /**
   * Get all todos
   */
  getTodos() {
    const todos = this.getItem(this.keys.todos);
    return todos || [];
  }

  /**
   * Add todo
   */
  addTodo(todo) {
    const todos = this.getTodos();
    const newTodo = {
      id: this.generateID(),
      createdAt: new Date().toISOString(),
      ...todo
    };
    todos.push(newTodo);
    this.setItem(this.keys.todos, todos);
    return newTodo;
  }

  /**
   * Update todo
   */
  updateTodo(id, updates) {
    const todos = this.getTodos();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates, updatedAt: new Date().toISOString() };
      this.setItem(this.keys.todos, todos);
      return todos[index];
    }
    return null;
  }

  /**
   * Delete todo
   */
  deleteTodo(id) {
    const todos = this.getTodos();
    const filtered = todos.filter(t => t.id !== id);
    this.setItem(this.keys.todos, filtered);
    return true;
  }

  /**
   * Get all notes
   */
  getNotes() {
    const notes = this.getItem(this.keys.notes);
    return notes || [];
  }

  /**
   * Add note
   */
  addNote(note) {
    const notes = this.getNotes();
    const newNote = {
      id: this.generateID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      ...note
    };
    notes.push(newNote);
    this.setItem(this.keys.notes, notes);
    return newNote;
  }

  /**
   * Update note
   */
  updateNote(id, updates) {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
      this.setItem(this.keys.notes, notes);
      return notes[index];
    }
    return null;
  }

  /**
   * Delete note
   */
  deleteNote(id) {
    const notes = this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    this.setItem(this.keys.notes, filtered);
    return true;
  }

  /**
   * Get theme preference
   */
  getTheme() {
    return this.getItem(this.keys.theme) || 'light';
  }

  /**
   * Set theme preference
   */
  setTheme(theme) {
    return this.setItem(this.keys.theme, theme);
  }

  /**
   * Get pomodoro data
   */
  getPomodoroData() {
    return this.getItem(this.keys.pomodoro) || {
      sessionsCompleted: 0,
      todaySessions: 0,
      lastSessionDate: null
    };
  }

  /**
   * Update pomodoro data
   */
  updatePomodoroData(updates) {
    const pomodoroData = this.getPomodoroData();
    const updated = { ...pomodoroData, ...updates };
    return this.setItem(this.keys.pomodoro, updated);
  }

  /**
   * Get streak data
   */
  getStreakData() {
    return this.getItem(this.keys.streak) || {
      currentStreak: 0,
      lastLoginDate: null,
      maxStreak: 0,
      totalDaysLogged: 0
    };
  }

  /**
   * Update streak (dipanggil saat login)
   */
  updateStreak() {
    const streak = this.getStreakData();
    const today = new Date().toDateString();
    const lastLogin = streak.lastLoginDate;

    if (lastLogin !== today) {
      const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
      const today_date = new Date();

      // Hitung hari antara last login dan hari ini
      const daysDiff = lastLoginDate
        ? Math.floor((today_date - lastLoginDate) / (1000 * 60 * 60 * 24))
        : 0;

      // Jika 1 hari, increment streak; jika > 1 hari, reset streak
      if (daysDiff === 1) {
        streak.currentStreak += 1;
      } else if (daysDiff > 1) {
        streak.currentStreak = 1;
      } else if (daysDiff === 0) {
        // Sudah login hari ini, tidak perlu update
        return;
      }

      // Update max streak
      if (streak.currentStreak > streak.maxStreak) {
        streak.maxStreak = streak.currentStreak;
      }

      streak.lastLoginDate = today;
      streak.totalDaysLogged += 1;

      this.setItem(this.keys.streak, streak);
    }
  }

  /**
   * Get badges
   */
  getBadges() {
    return this.getItem(this.keys.badges) || [];
  }

  /**
   * Award badge
   */
  awardBadge(badgeId) {
    const badges = this.getBadges();
    if (!badges.find(b => b.id === badgeId)) {
      badges.push({
        id: badgeId,
        awardedAt: new Date().toISOString()
      });
      this.setItem(this.keys.badges, badges);
      return true;
    }
    return false;
  }

  /**
   * Get user XP
   */
  getUserXP() {
    const user = this.getUser();
    return user ? user.xp || 0 : 0;
  }

  /**
   * Add XP
   */
  addXP(amount) {
    const user = this.getUser();
    if (user) {
      user.xp = (user.xp || 0) + amount;
      this.setUser(user);
      return user.xp;
    }
    return 0;
  }

  /**
   * Check storage size
   */
  getStorageSize() {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
        size += localStorage[key].length + key.length;
      }
    }
    return {
      bytes: size,
      kb: (size / 1024).toFixed(2),
      mb: (size / 1024 / 1024).toFixed(2),
      percentage: ((size / (5 * 1024 * 1024)) * 100).toFixed(2) // 5MB limit
    };
  }

  /**
   * Show storage error
   */
  showStorageError() {
    const size = this.getStorageSize();
    console.warn(`Storage penuh! ${size.mb}MB / 5MB`);
    alert('Storage hampir penuh! Hapus beberapa catatan atau tugas untuk melanjutkan.');
  }

  /**
   * Initialize default data
   */
  initializeDefaultData() {
    if (!this.getUser()) {
      // Buat user default untuk testing
      const defaultUser = {
        id: this.generateID(),
        name: 'Pengguna Demo',
        username: 'demo',
        email: 'demo@studynest.local',
        kelas: 'XI',
        jurusan: 'IPA',
        avatar: '👤',
        joinDate: new Date().toISOString(),
        xp: 0,
        badges: []
      };
      this.setUser(defaultUser);
    }

    // Initialize default todos & notes jika kosong
    if (this.getTodos().length === 0) {
      this.addTodo({
        title: 'Contoh: Belajar Matematika Integral',
        subject: 'Matematika',
        deadline: '2025-06-10',
        priority: 'high',
        description: 'Ini adalah contoh tugas. Klik untuk edit atau hapus.',
        completed: false,
        subtasks: []
      });
    }

    if (this.getNotes().length === 0) {
      this.addNote({
        title: 'Contoh Catatan',
        subject: 'Matematika',
        textContent: '<p>Selamat datang di StudyNest! Ini adalah contoh catatan pertamamu.</p>',
        hasDrawing: false,
        tags: ['contoh']
      });
    }
  }
}

// Create global instance
const storage = new StorageManager();

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
