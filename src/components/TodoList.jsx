import React, { useState, useEffect, useMemo } from 'react';
import { Edit3, Trash2, Check, Clock, RotateCcw, BarChart2, Download, Upload, Save, X, Play, Pause } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'hbtu_todos';

// Utility function to format seconds into MM:SS
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const TodoList = () => {
  // State initialization
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [activeTimers, setActiveTimers] = useState({}); // To hold setInterval IDs

  // 1. Local Storage: Load todos on mount
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setTodos(storedTodos);
  }, []);

  // 2. Local Storage: Save todos whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Clean up intervals when component unmounts or timers change
  useEffect(() => {
    return () => {
      Object.values(activeTimers).forEach(clearInterval);
    };
  }, [activeTimers]);

  // --- CRUD Operations ---

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      task: inputValue.trim(),
      completed: false,
      timeSpent: 0,
      isTimerRunning: false,
      timerDuration: 25 * 60, // Pomodoro default: 25 minutes
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInputValue('');
  };

  const deleteTodo = (id) => {
    // Stop timer if running
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      });
    }
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    // Automatically pause timer when task is completed
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed && todo.isTimerRunning) {
        pauseTimer(id);
    }

    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start editing task
  const startEditing = (id, currentTask) => {
    setEditingId(id);
    setEditValue(currentTask);
  };

  // Save edited task
  const saveEdit = (id) => {
    if (editValue.trim() === '') return;
    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, task: editValue.trim() } : todo
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  // --- Timer Functionality ---

  const startTimer = (id) => {
    // Clear existing interval if any
    if (activeTimers[id]) clearInterval(activeTimers[id]);

    const interval = setInterval(() => {
      setTodos(prevTodos => {
        return prevTodos.map(t => {
          if (t.id === id) {
            const newTimeSpent = t.timeSpent + 1;
            // If timer duration is complete
            if (newTimeSpent >= t.timerDuration) {
              clearInterval(activeTimers[id]);
              setActiveTimers(prev => {
                const newTimers = { ...prev };
                delete newTimers[id];
                return newTimers;
              });
              // Stop timer and mark as complete
              return { ...t, timeSpent: t.timerDuration, isTimerRunning: false, completed: true };
            }
            return { ...t, timeSpent: newTimeSpent };
          }
          return t;
        });
      });
    }, 1000);

    // Add timer to active timers state
    setActiveTimers(prev => ({ ...prev, [id]: interval }));
    
    // Set running flag in Todo state
    setTodos(prevTodos => prevTodos.map(t =>
        t.id === id ? { ...t, isTimerRunning: true } : t
    ));
  };


  const pauseTimer = (id) => {
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      });
      setTodos(prevTodos => prevTodos.map(t =>
        t.id === id ? { ...t, isTimerRunning: false } : t
      ));
    }
  };

  const resetTimer = (id) => {
    pauseTimer(id);
    setTodos(prevTodos => prevTodos.map(t =>
      t.id === id ? { ...t, timeSpent: 0 } : t
    ));
  };


  // --- Filter and Data ---

  const filteredTodos = useMemo(() => {
      return todos
        .filter(todo => {
          if (filter === 'completed') return todo.completed;
          if (filter === 'uncompleted') return !todo.completed;
          return true;
        })
        .sort((a, b) => {
            // Sort by completed status first (Completed tasks at bottom)
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            // Then by ID (creation date - newest task on top)
            return b.id - a.id;
        });
  }, [todos, filter]);


  // Statistics Calculation
  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    timeTracked: formatTime(todos.reduce((sum, t) => sum + t.timeSpent, 0))
  }), [todos]);

  // --- Export/Import ---

  const exportTasks = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); 
    
    URL.revokeObjectURL(url);
    console.log('Tasks successfully exported!');
  };

  // Import tasks
  const handleImportTasks = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target.result);
        if (Array.isArray(importedTasks) && importedTasks.every(t => t.task && typeof t.completed === 'boolean')) {
            // Replace all existing tasks with imported tasks
            setTodos(importedTasks);
            console.log('Tasks successfully imported!');
        } else {
            console.error('Invalid imported data structure.');
            // Implement custom error UI instead of alert()
        }
      } catch (error) {
        console.error('File parse error:', error);
        // Implement custom error UI instead of alert()
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be selected again
    e.target.value = null; 
  };


  // --- Render ---

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER AND ADD FORM */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">My To-Do List 🚀</h2>
      
      <div className="bg-white shadow-lg rounded-xl p-5 mb-8">
        <form onSubmit={addTodo} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50" disabled={!inputValue.trim()}>
            Add Task
          </button>
        </form>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <StatCard title="Total Tasks" value={stats.total} color="bg-blue-100 text-blue-800" />
        <StatCard title="Completed" value={stats.completed} color="bg-green-100 text-green-800" />
        <StatCard title="Active" value={stats.active} color="bg-yellow-100 text-yellow-800" />
        <StatCard title="Time Tracked" value={stats.timeTracked} color="bg-purple-100 text-purple-800" />
      </div>

      {/* FILTER BUTTONS AND ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-inner">
        <div className="flex gap-2 mb-4 md:mb-0">
          <FilterButton currentFilter={filter} target="all" setFilter={setFilter} label="All Tasks" />
          <FilterButton currentFilter={filter} target="uncompleted" setFilter={setFilter} label="Active Tasks" />
          <FilterButton currentFilter={filter} target="completed" setFilter={setFilter} label="Completed" />
        </div>
        
        {/* EXPORT / IMPORT BUTTONS */}
        <div className="flex gap-3">
          <button onClick={exportTasks} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center transition duration-200">
            <Download size={18} className="mr-2" /> Export
          </button>
          <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center transition duration-200 cursor-pointer">
            <Upload size={18} className="mr-2" /> Import
            <input type="file" accept=".json" onChange={handleImportTasks} className="hidden" />
          </label>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="bg-white shadow-xl rounded-xl">
        <ul className="divide-y divide-gray-100">
          {filteredTodos.length === 0 && (
             <p className="text-center text-gray-500 p-8">
                {filter === 'all' ? 'No tasks yet. Add one above!' : 'No tasks match this filter.'}
             </p>
          )}

          {filteredTodos.map(todo => (
            <li key={todo.id} className="p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center group">
              
              <div className="flex items-center space-x-4 flex-grow w-full md:w-auto">
                {/* Completion Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />

                {/* Task Text / Edit Input */}
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(todo.id); }}
                    className="flex-grow p-1 border border-indigo-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    autoFocus
                  />
                ) : (
                  <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'} flex-grow cursor-pointer`}
                        onClick={() => toggleComplete(todo.id)}
                  >
                    {todo.task}
                  </span>
                )}
              </div>

              {/* ACTIONS (Timer, Edit, Delete) */}
              <div className="flex items-center space-x-3 mt-3 md:mt-0 md:ml-4">
                
                {/* TIMER DISPLAY */}
                <div className="flex items-center text-sm font-mono bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full shadow-inner">
                  <Clock size={16} className="mr-1" />
                  {formatTime(todo.timeSpent)} / {formatTime(todo.timerDuration)}
                </div>

                {/* TIMER CONTROLS */}
                <button 
                  onClick={() => todo.isTimerRunning ? pauseTimer(todo.id) : startTimer(todo.id)}
                  className={`p-2 rounded-full shadow-md transition duration-150 ${todo.isTimerRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  title={todo.isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                  disabled={todo.completed}
                >
                  {todo.isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                    onClick={() => resetTimer(todo.id)}
                    className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition duration-150"
                    title="Reset Timer"
                >
                    <RotateCcw size={18} />
                </button>

                {/* EDIT & DELETE BUTTONS */}
                {editingId !== todo.id && (
                    <>
                        <button
                            onClick={() => startEditing(todo.id, todo.task)}
                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition duration-150"
                            title="Edit Task"
                            disabled={todo.completed}
                        >
                            <Edit3 size={18} />
                        </button>
                        <button 
                            onClick={() => deleteTodo(todo.id)}
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition duration-150"
                            title="Delete Task"
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
                {editingId === todo.id && (
                    <button
                        onClick={() => saveEdit(todo.id)}
                        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md transition duration-150"
                        title="Save Changes"
                    >
                        <Save size={18} />
                    </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

// Sub-component for displaying statistics
const StatCard = ({ title, value, color }) => (
    <div className={`p-4 rounded-xl shadow-md ${color}`}>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
    </div>
);

// Sub-component for filter buttons
const FilterButton = ({ currentFilter, target, setFilter, label }) => (
    <button
        onClick={() => setFilter(target)}
        className={`font-semibold py-2 px-4 rounded-lg transition duration-150 text-sm 
            ${currentFilter === target 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`
        }
    >
        {label}
    </button>
);

export default TodoList;
