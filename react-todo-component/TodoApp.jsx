import { useState } from "react";

// Simple Todo App — demonstrates useState and list rendering
export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");

    const addTodo = () => {
        if (!input.trim()) return;
        setTodos([...todos, { id: Date.now(), text: input, done: false }]);
        setInput("");
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
            <h2>Todo App</h2>
            <div style={{ display: "flex", gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTodo()}
                    placeholder="Add a task..."
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={addTodo}>Add</button>
            </div>
            <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none" }}>
                {todos.map(todo => (
                    <li key={todo.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                        <span
                            onClick={() => toggleTodo(todo.id)}
                            style={{ cursor: "pointer", textDecoration: todo.done ? "line-through" : "none", color: todo.done ? "#aaa" : "#000" }}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>✕</button>
                    </li>
                ))}
            </ul>
            {todos.length === 0 && <p style={{ color: "#aaa" }}>No tasks yet. Add one above.</p>}
        </div>
    );
}