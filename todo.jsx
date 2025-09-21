import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State for managing the list of todos
  const [todos, setTodos] = useState([]);
  // State for the new todo input text
  const [newTodo, setNewTodo] = useState('');
  // State for the priority of a new todo
  const [newPriority, setNewPriority] = useState('Medium');
  // State for the due date of a new todo
  const [newDueDate, setNewDueDate] = useState('');
  // State for the current theme (light or dark)
  const [theme, setTheme] = useState('light');
  // State for the active filter ('All', 'Active', 'Completed')
  const [filter, setFilter] = useState('All');
  // State for the sort order ('dueDate' or 'priority')
  const [sortBy, setSortBy] = useState('dueDate');
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for a confirmation modal for deletion
  const [showConfirm, setShowConfirm] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  // State for editing a todo
  const [editingTodo, setEditingTodo] = useState(null);
  // State to manage the current view ('list' or 'dashboard')
  const [currentPage, setCurrentPage] = useState('list');

  // Use useEffect to load todos and theme from localStorage on component mount
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTodos(storedTodos);
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setTodos([]);
    }
  }, []);

  // Use useEffect to save todos and theme to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [todos, theme]);

  // Handle adding a new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    const newTodoItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      priority: newPriority,
      dueDate: newDueDate,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
    setNewDueDate('');
  };

  // Handle toggling the completion status of a todo
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle deleting a todo, showing a confirmation modal first
  const handleDeleteClick = (id) => {
    setTodoToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setTodos(todos.filter((todo) => todo.id !== todoToDelete));
    setShowConfirm(false);
    setTodoToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setTodoToDelete(null);
  };

  // Handle editing a todo
  const handleEditClick = (todo) => {
    setEditingTodo({ ...todo });
  };

  const handleEditChange = (e) => {
    setEditingTodo({ ...editingTodo, text: e.target.value });
  };

  const saveEdit = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? editingTodo : todo)));
    setEditingTodo(null);
  };

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Handle clearing all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Filtering and sorting logic
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'Active') return !todo.completed;
      if (filter === 'Completed') return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'High':
        return 'High';
      case 'Medium':
        return 'Medium';
      case 'Low':
        return 'Low';
      default:
        return 'Uncategorized';
    }
  };

  // Dashboard Component
  const DashboardPage = () => {
    const totalTasks = todos.length;
    const completedTasks = todos.filter((todo) => todo.completed).length;
    const highPriority = todos.filter((todo) => todo.priority === 'High').length;
    const mediumPriority = todos.filter((todo) => todo.priority === 'Medium').length;
    const lowPriority = todos.filter((todo) => todo.priority === 'Low').length;

    const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const highPercentage = totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0;
    const mediumPercentage = totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0;
    const lowPercentage = totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0;

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gray-200 dark:bg-gray-700 shadow-sm text-center">
            <h3 className="text-xl font-semibold">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2">{totalTasks}</p>
          </div>
          <div className="p-4 rounded-xl bg-green-200 dark:bg-green-700 shadow-sm text-center">
            <h3 className="text-xl font-semibold">Completed</h3>
            <p className="text-3xl font-bold mt-2">{completedTasks}</p>
          </div>
          <div className="p-4 rounded-xl bg-yellow-200 dark:bg-yellow-700 shadow-sm text-center">
            <h3 className="text-xl font-semibold">Active</h3>
            <p className="text-3xl font-bold mt-2">{totalTasks - completedTasks}</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-200 dark:bg-blue-700 shadow-sm text-center">
            <h3 className="text-xl font-semibold">Incomplete</h3>
            <p className="text-3xl font-bold mt-2">{totalTasks - completedTasks}</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-center">Priority Breakdown</h3>
          <div className="h-48 flex items-end justify-around">
            <div className="flex flex-col items-center">
              <div className="w-12 rounded-t-lg bg-red-500 transition-all duration-300" style={{ height: `${highPercentage}%` }}></div>
              <span className="text-sm mt-2">High ({highPriority})</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 rounded-t-lg bg-yellow-500 transition-all duration-300" style={{ height: `${mediumPercentage}%` }}></div>
              <span className="text-sm mt-2">Medium ({mediumPriority})</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 rounded-t-lg bg-green-500 transition-all duration-300" style={{ height: `${lowPercentage}%` }}></div>
              <span className="text-sm mt-2">Low ({lowPriority})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Task List Page Component
  const TaskListPage = () => (
    <>
      <form onSubmit={addTodo} className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-grow p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Add
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <input
            type="date"
            className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
        </div>
      </form>

      {/* Filters, sort and search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex space-x-2">
          {['All', 'Active', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Todo list */}
      <ul className="space-y-4">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500 italic">No tasks match your criteria.</p>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex-grow flex flex-col space-y-1">
                {editingTodo?.id === todo.id ? (
                  <input
                    type="text"
                    value={editingTodo.text}
                    onChange={handleEditChange}
                    onBlur={() => saveEdit(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit(todo.id);
                      }
                    }}
                    autoFocus
                    className="text-lg p-1 rounded-md bg-white dark:bg-gray-800 focus:outline-none"
                  />
                ) : (
                  <div
                    className={`text-lg font-medium break-words transition-colors duration-200 ${
                      todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {todo.text}
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getPriorityColor(todo.priority)}`}>
                    {getPriorityLabel(todo.priority)}
                  </span>
                  {todo.dueDate && (
                    <span className={`text-xs ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-500 font-bold' : ''}`}>
                      Due: {todo.dueDate}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0 sm:ml-4">
                <button
                  onClick={() => handleEditClick(todo)}
                  className="p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200"
                  aria-label="Edit task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v2.25M6.5 18a.5.5 0 100-1 .5.5 0 000 1z" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="p-2 text-green-500 rounded-full hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
                  aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(todo.id)}
                  className="p-2 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition-colors duration-200"
                  aria-label="Delete task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.13h-4.633a2.25 2.25 0 01-2.244-2.13L5.59 6.75m1.588-.354c.24-.047.48-.096.72-.146m-.72.146a.75.75 0 01-.194-.282m1.077-.282a.75.75 0 01.194.282m-1.077-.282a.75.75 0 00-1.096.398l-1.636 4.757m.657-4.757a.75.75 0 00-1.096-.398m-1.636-4.757a.75.75 0 00-.547-.197" />
                  </svg>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {todos.length > 0 && todos.some(todo => todo.completed) && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={clearCompleted}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800 transition-all duration-200"
          >
            Clear Completed Tasks
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 font-inter">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-xl transition-colors duration-300">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-center">Task App</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage('list')}
              className={`p-2 rounded-full ${currentPage === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              aria-label="View task list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`p-2 rounded-full ${currentPage === 'dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              aria-label="View dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l5.25 5.25m5.25-5.25L21 9m-13.5 0l5.25 5.25m-5.25 5.25L21 15" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0015 21a9.753 9.753 0 006.752-6.002z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.364l-1.591 1.591M21 12h-2.25m-.364 6.364l-1.591-1.591M12 18.75V21m-6.364-.364l1.591-1.591M3 12H5.25m.364-6.364l1.591 1.591M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </header>
        
        {currentPage === 'list' ? <TaskListPage /> : <DashboardPage />}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
