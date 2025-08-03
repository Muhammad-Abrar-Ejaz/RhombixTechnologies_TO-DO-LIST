class SimpleTodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
        this.updateTaskCount();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
    }

    bindEvents() {
        // Add task events
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (!taskText) {
            this.showAlert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        this.tasks.unshift(task);
        this.saveToLocalStorage();
        this.renderTasks();
        this.updateTaskCount();
        
        // Clear input
        this.taskInput.value = '';
        this.taskInput.focus();
        
        // Show success message
        this.showAlert('Task added successfully!', 'success');
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToLocalStorage();
        this.renderTasks();
        this.updateTaskCount();
        this.showAlert('Task deleted!');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateTaskCount();
            
            const message = task.completed ? 'Task completed! 🎉' : 'Task marked as active!';
            this.showAlert(message, task.completed ? 'success' : 'info');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveToLocalStorage();
                this.renderTasks();
                this.showAlert('Task updated successfully!', 'success');
            }
        }
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);
        if (completedTasks.length === 0) {
            this.showAlert('No completed tasks to clear!');
            return;
        }

        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveToLocalStorage();
        this.renderTasks();
        this.updateTaskCount();
        this.showAlert(`Cleared ${completedTasks.length} completed tasks!`, 'success');
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No tasks yet!</h3>
                    <p>Start by adding your first task above.</p>
                </div>
            `;
        } else {
            this.taskList.innerHTML = this.tasks.map(task => `
                <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
                    <div class="task-actions">
                        <button class="action-btn edit-btn">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </li>
            `).join('');

            // Bind events to new elements
            this.bindTaskEvents();
        }
    }

    bindTaskEvents() {
        // Checkbox events
        this.taskList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.toggleTask(taskId);
            });
        });

        // Edit button events
        this.taskList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.editTask(taskId);
            });
        });

        // Delete button events
        this.taskList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                if (confirm('Are you sure you want to delete this task?')) {
                    this.deleteTask(taskId);
                }
            });
        });
    }

    updateTaskCount() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;

        this.taskCount.textContent = `${activeTasks} active, ${completedTasks} completed`;
    }

    saveToLocalStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showAlert(message, type = 'info') {
        // Create a simple alert notification
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        // Animate in
        setTimeout(() => {
            alert.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            alert.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleTodoApp();
}); 