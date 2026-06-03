/* ============================================
   THEME.JS - StudyNest
   Dark Mode Toggle & Theme Management
   ============================================ */

/**
 * Theme Manager
 */
class ThemeManager {
  constructor() {
    this.currentTheme = storage.getTheme() || 'light';
    this.init();
  }

  /**
   * Initialize theme
   */
  init() {
    this.applyTheme(this.currentTheme);
  }

  /**
   * Apply theme
   */
  applyTheme(theme) {
    const body = document.body;

    if (theme === 'dark') {
      body.classList.add('dark');
      this.currentTheme = 'dark';
    } else {
      body.classList.remove('dark');
      this.currentTheme = 'light';
    }

    storage.setTheme(theme);
    this.updateThemeIcon();
  }

  /**
   * Toggle theme
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    return newTheme;
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Update theme toggle button icon
   */
  updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', 
        this.currentTheme === 'light' ? 'Aktifkan dark mode' : 'Aktifkan light mode'
      );
    }
  }

  /**
   * Detect system preference
   */
  detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Listen to system theme changes
   */
  listenToSystemChanges() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
      });
    }
  }

  /**
   * Set theme to auto (follow system)
   */
  setAutoTheme() {
    const systemTheme = this.detectSystemPreference();
    this.applyTheme(systemTheme);
    this.listenToSystemChanges();
  }
}

// Create global instance
const theme = new ThemeManager();

// Setup theme toggle button listener
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      theme.toggle();
    });
  }
});
