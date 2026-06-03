/* ============================================
   DASHBOARD.JS - StudyNest
   Dashboard Logic: Streak, Stats, Quick Actions
   ============================================ */

/**
 * Dashboard Manager
 */
class DashboardManager {
  constructor() {
    this.init();
  }

  /**
   * Initialize dashboard
   */
  init() {
    if (!auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    this.loadUserData();
    this.setupEventListeners();
    this.updateStats();
  }

  /**
   * Load user data and display
   */
  loadUserData() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Update user info
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const userKelas = document.getElementById('user-kelas');

    if (userName) userName.textContent = user.name;
    if (userAvatar) userAvatar.textContent = user.avatar;
    if (userKelas) userKelas.textContent = `${user.kelas} - ${user.jurusan}`;

    // Update XP display
    this.updateXPDisplay(user.xp || 0);
  }

  /**
   * Update statistics
   */
  updateStats() {
    const todos = storage.getTodos();
    const notes = storage.getNotes();
    const streak = storage.getStreakData();
    const pomodoro = storage.getPomodoroData();

    // Update counts
    const completedTodos = todos.filter(t => t.completed).length;
    const totalTodos = todos.length;

    document.getElementById('stat-todos')?.textContent = totalTodos;
    document.getElementById('stat-completed')?.textContent = completedTodos;
    document.getElementById('stat-notes')?.textContent = notes.length;
    document.getElementById('stat-streak')?.textContent = streak.currentStreak || 0;
    document.getElementById('stat-pomodoro')?.textContent = pomodoro.sessionsCompleted || 0;

    // Update progress bar
    this.updateProgressBar(completedTodos, totalTodos);

    // Update streak display
    this.updateStreakDisplay(streak);
  }

  /**
   * Update progress bar
   */
  updateProgressBar(completed, total) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }

    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `${completed}/${total}`;
    }
  }

  /**
   * Update streak display
   */
  updateStreakDisplay(streak) {
    const streakDisplay = document.getElementById('streak-display');
    if (streakDisplay) {
      streakDisplay.innerHTML = `
        <div class="streak-card">
          <div class="streak-flame">🔥</div>
          <div class="streak-info">
            <div class="streak-count">${streak.currentStreak || 0}</div>
            <div class="streak-label">Hari Berturut-turut</div>
          </div>
        </div>
        <div class="streak-details">
          <p>Maksimal: ${streak.maxStreak || 0} hari</p>
          <p>Total Login: ${streak.totalDaysLogged || 0} hari</p>
        </div>
      `;
    }
  }

  /**
   * Update XP display
   */
  updateXPDisplay(xp) {
    const xpElement = document.getElementById('user-xp');
    if (xpElement) {
      xpElement.textContent = `${xp} XP`;
    }

    // Calculate level (setiap 100 XP = 1 level)
    const level = Math.floor(xp / 100) + 1;
    const xpInLevel = xp % 100;
    const nextLevelXp = 100;

    const levelElement = document.getElementById('user-level');
    if (levelElement) {
      levelElement.textContent = `Level ${level}`;
    }

    // Update XP progress bar
    this.updateXPProgressBar(xpInLevel, nextLevelXp);
  }

  /**
   * Update XP progress bar
   */
  updateXPProgressBar(current, max) {
    const xpProgressBar = document.querySelector('.xp-progress-bar');
    if (xpProgressBar) {
      const percentage = (current / max) * 100;
      xpProgressBar.style.width = percentage + '%';
    }
  }

  /**
   * Display recent todos
   */
  displayRecentTodos() {
    const todos = storage.getTodos();
    const recentTodos = todos.slice(0, 5);
    const todoList = document.getElementById('recent-todos');

    if (!todoList) return;

    if (recentTodos.length === 0) {
      todoList.innerHTML = '<p class="empty-state">Tidak ada tugas. Buat tugas baru untuk memulai! 📝</p>';
      return;
    }

    todoList.innerHTML = recentTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} 
               onchange="dashboardManager.toggleTodo('${todo.id}')">
        <div class="todo-details">
          <div class="todo-title">${todo.title}</div>
          <div class="todo-meta">
            <span class="subject-badge">${todo.subject}</span>
            <span class="priority-${todo.priority}">${todo.priority.toUpperCase()}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Toggle todo completion
   */
  toggleTodo(todoId) {
    const todo = storage.getTodos().find(t => t.id === todoId);
    if (todo) {
      const updated = storage.updateTodo(todoId, { completed: !todo.completed });
      if (updated && !todo.completed) {
        // Award XP untuk completed task
        storage.addXP(10);
        this.showXPNotification(10);
      }
      this.updateStats();
      this.displayRecentTodos();
    }
  }

  /**
   * Display recent notes
   */
  displayRecentNotes() {
    const notes = storage.getNotes();
    const recentNotes = notes.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    ).slice(0, 4);

    const notesList = document.getElementById('recent-notes');
    if (!notesList) return;

    if (recentNotes.length === 0) {
      notesList.innerHTML = '<p class="empty-state">Tidak ada catatan. Buat catatan baru! 📖</p>';
      return;
    }

    notesList.innerHTML = recentNotes.map(note => `
      <div class="note-preview">
        <div class="note-header">
          <h4>${note.title}</h4>
          ${note.isPinned ? '<span class="pin-icon">📌</span>' : ''}
        </div>
        <p class="note-excerpt">${this.truncateText(note.textContent, 60)}</p>
        <div class="note-footer">
          <span class="subject-badge">${note.subject}</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * Truncate text
   */
  truncateText(text, length) {
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
  }

  /**
   * Show XP notification
   */
  showXPNotification(xp) {
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.textContent = `+${xp} XP!`;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Refresh stats button
    document.getElementById('refresh-stats')?.addEventListener('click', () => {
      this.updateStats();
      this.displayRecentTodos();
      this.displayRecentNotes();
    });

    // New todo button
    document.getElementById('btn-new-todo')?.addEventListener('click', () => {
      window.location.href = 'todo.html';
    });

    // New note button
    document.getElementById('btn-new-note')?.addEventListener('click', () => {
      window.location.href = 'note-editor.html';
    });

    // Pomodoro button
    document.getElementById('btn-pomodoro')?.addEventListener('click', () => {
      window.location.href = 'dashboard.html#pomodoro';
    });
  }

  /**
   * Get daily stats for chart
   */
  getDailyStats() {
    const today = new Date();
    const stats = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      const todos = storage.getTodos().filter(t => 
        new Date(t.createdAt).toDateString() === dateStr
      );
      const completedTodos = todos.filter(t => t.completed).length;

      stats.push({
        date: dateStr.split(' ')[0] + ' ' + dateStr.split(' ')[2],
        completed: completedTodos,
        total: todos.length
      });
    }

    return stats;
  }
}

// Create global instance
const dashboardManager = new DashboardManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  dashboardManager.displayRecentTodos();
  dashboardManager.displayRecentNotes();
});
