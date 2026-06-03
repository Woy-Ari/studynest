/* ============================================
   TODO.JS - StudyNest
   Todo/Task CRUD Operations & Management
   ============================================ */

/**
 * Todo Manager
 */
class TodoManager {
  constructor() {
    this.currentFilter = 'all';
    this.currentSort = 'priority';
    this.init();
  }

  /**
   * Initialize todo manager
   */
  init() {
    if (!auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    this.setupEventListeners();
    this.render();
  }

  /**
   * Get todos with filter and sort
   */
  getTodosFiltered() {
    let todos = storage.getTodos();

    // Apply filter
    if (this.currentFilter === 'completed') {
      todos = todos.filter(t => t.completed);
    } else if (this.currentFilter === 'pending') {
      todos = todos.filter(t => !t.completed);
    }

    // Apply sort
    if (this.currentSort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (this.currentSort === 'deadline') {
      todos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (this.currentSort === 'date-created') {
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return todos;
  }

  /**
   * Group todos by subject
   */
  groupBySubject(todos) {
    const grouped = {};
    todos.forEach(todo => {
      if (!grouped[todo.subject]) {
        grouped[todo.subject] = [];
      }
      grouped[todo.subject].push(todo);
    });
    return grouped;
  }

  /**
   * Render todos
   */
  render() {
    const todos = this.getTodosFiltered();
    const todoContainer = document.getElementById('todos-container');

    if (!todoContainer) return;

    if (todos.length === 0) {
      todoContainer.innerHTML = `
        <div class="empty-state">
          <p>✨ Tidak ada tugas di kategori ini!</p>
          <button class="btn btn-primary" onclick="todoManager.showAddForm()">Buat Tugas Baru</button>
        </div>
      `;
      return;
    }

    const grouped = this.groupBySubject(todos);

    todoContainer.innerHTML = Object.entries(grouped).map(([subject, subjectTodos]) => `
      <div class="subject-group">
        <h3 class="subject-title">${subject}</h3>
        <div class="todos-list">
          ${subjectTodos.map(todo => this.renderTodoItem(todo)).join('')}
        </div>
      </div>
    `).join('');
  }

  /**
   * Render single todo item
   */
  renderTodoItem(todo) {
    const isOverdue = new Date(todo.deadline) < new Date() && !todo.completed;
    const daysLeft = this.getDaysUntilDeadline(todo.deadline);

    return `
      <div class="todo-card ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
        <div class="todo-checkbox">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                 onchange="todoManager.toggleTodo('${todo.id}')">
        </div>

        <div class="todo-main">
          <div class="todo-header">
            <h4 class="todo-title">${todo.title}</h4>
            <div class="todo-badges">
              <span class="badge badge-${todo.priority}">${todo.priority.toUpperCase()}</span>
              ${isOverdue ? '<span class="badge badge-danger">OVERDUE</span>' : ''}
            </div>
          </div>

          ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}

          <div class="todo-meta">
            <span class="deadline">📅 ${new Date(todo.deadline).toLocaleDateString('id-ID')}</span>
            ${daysLeft !== null ? `
              <span class="days-left ${daysLeft < 1 ? 'urgent' : daysLeft < 3 ? 'warning' : ''}">
                ${daysLeft === 0 ? 'Hari ini' : daysLeft > 0 ? `${daysLeft} hari lagi` : 'Overdue'}
              </span>
            ` : ''}
          </div>

          ${todo.subtasks && todo.subtasks.length > 0 ? `
            <div class="subtasks">
              ${todo.subtasks.map((subtask, idx) => `
                <div class="subtask ${subtask.completed ? 'completed' : ''}">
                  <input type="checkbox" ${subtask.completed ? 'checked' : ''} 
                         onchange="todoManager.toggleSubtask('${todo.id}', ${idx})">
                  <span>${subtask.title}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="todo-actions">
          <button class="btn-icon" onclick="todoManager.editTodo('${todo.id}')" title="Edit">✏️</button>
          <button class="btn-icon" onclick="todoManager.deleteTodo('${todo.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }

  /**
   * Get days until deadline
   */
  getDaysUntilDeadline(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diff = deadlineDate - today;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Toggle todo completion
   */
  toggleTodo(todoId) {
    const todos = storage.getTodos();
    const todo = todos.find(t => t.id === todoId);

    if (todo) {
      const wasCompleted = todo.completed;
      storage.updateTodo(todoId, { completed: !todo.completed });

      // Award XP jika baru selesai
      if (!wasCompleted) {
        storage.addXP(10);
        this.showNotification('✅ +10 XP untuk menyelesaikan tugas!', 'success');
      }

      this.render();
    }
  }

  /**
   * Toggle subtask
   */
  toggleSubtask(todoId, subtaskIndex) {
    const todos = storage.getTodos();
    const todo = todos.find(t => t.id === todoId);

    if (todo && todo.subtasks) {
      todo.subtasks[subtaskIndex].completed = !todo.subtasks[subtaskIndex].completed;
      storage.updateTodo(todoId, { subtasks: todo.subtasks });
      this.render();
    }
  }

  /**
   * Delete todo
   */
  deleteTodo(todoId) {
    if (confirm('Hapus tugas ini?')) {
      storage.deleteTodo(todoId);
      this.showNotification('Tugas dihapus', 'success');
      this.render();
    }
  }

  /**
   * Edit todo
   */
  editTodo(todoId) {
    const todo = storage.getTodos().find(t => t.id === todoId);
    if (todo) {
      // Store in session storage untuk diambil di edit page
      sessionStorage.setItem('editingTodo', JSON.stringify(todo));
      window.location.href = 'todo-editor.html';
    }
  }

  /**
   * Show add form
   */
  showAddForm() {
    sessionStorage.removeItem('editingTodo');
    window.location.href = 'todo-editor.html';
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
      });
    });

    // Sort select
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.render();
    });

    // New todo button
    document.getElementById('btn-new-todo')?.addEventListener('click', () => {
      this.showAddForm();
    });
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `toast toast-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }
}

// Create global instance
const todoManager = new TodoManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  todoManager.render();
});
