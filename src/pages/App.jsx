import React, { useState, useEffect, useMemo } from 'react';

// Tailwind classes for basic styling
const containerClass = "p-6 bg-white rounded-xl shadow-2xl max-w-lg mx-auto mt-8";
const statBoxClass = "p-3 bg-indigo-100 rounded-lg text-indigo-700 font-semibold";
const taskItemClass = "flex justify-between items-center p-3 my-2 bg-gray-50 rounded-lg shadow-sm";
const buttonBase = "px-3 py-1 text-sm rounded-lg transition duration-150";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from LocalStorage
    const saved = localStorage.getItem('hbtu_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState('text');

  // Save tasks to LocalStorage
  useEffect(() => {
    localStorage.setItem('hbtu_todos', JSON.stringify(tasks));
  }, [tasks]);

  // Task CRUD: Add
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      date: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  // Task CRUD: Toggle Complete
  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Task CRUD: Delete
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filtering Logic
  const filteredTasks = useMemo(() => {
    let list = tasks;

    // Filter
    if (filter === 'completed') {
      list = list.filter(t => t.completed);
    } else if (filter === 'pending') {
      list = list.filter(t => !t.completed);
    }

    // Sort (simple sort by text or date)
    return list.sort((a, b) => {
      if (sortKey === 'text') return a.text.localeCompare(b.text);
      if (sortKey === 'date') return new Date(b.date) - new Date(a.date);
      return 0;
    });
  }, [tasks, filter, sortKey]);

  // Statistics Calculation
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  }), [tasks]);

  // Export/Import functionality
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hbtu_todos_export.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('Tasks successfully exported!'); // Replaced alert()
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks);
            console.log('Tasks successfully imported!'); // Replaced alert()
          } else {
            console.error('Import failed: File content is not a valid task array.'); // Replaced alert()
          }
        } catch (error) {
          console.error('Import failed: Could not parse JSON file.'); // Replaced alert()
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">To-Do List Manager</h2>
      
      {/* 1. Statistics Section */}
      <div className="flex justify-around mb-6 text-xs gap-2">
        <div className={statBoxClass}>Total: {stats.total}</div>
        <div className={statBoxClass}>Completed: {stats.completed}</div>
        <div className={statBoxClass}>Pending: {stats.pending}</div>
      </div>

      {/* 2. Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Write a new task..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className={`${buttonBase} bg-indigo-600 hover:bg-indigo-700 text-white shadow-md`}
        >
          Add Task
        </button>
      </form>

      {/* 3. Filter and Sort Controls */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex gap-2 items-center">
          <label className="text-gray-600 font-medium">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-gray-600 font-medium">Sort:</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date">Date</option>
            <option value="text">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* 4. Task List */}
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No tasks found. Add a new task!</p>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id} className={`${taskItemClass} ${task.completed ? 'opacity-60 border-l-4 border-green-500' : 'border-l-4 border-indigo-500'}`}>
              <span 
                className={`flex-grow text-left cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                onClick={() => toggleComplete(task.id)}
              >
                {task.text}
              </span>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`${buttonBase} ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className={`${buttonBase} bg-red-500 hover:bg-red-600 text-white`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* 5. Export/Import Controls (Enhanced Features) */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleExport}
          className={`${buttonBase} bg-blue-500 hover:bg-blue-600 text-white`}
        >
          Export Tasks
        </button>
        <label className={`${buttonBase} bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800`}>
          Import Tasks
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </div>
    </div>
  );
};

export default TodoList;
