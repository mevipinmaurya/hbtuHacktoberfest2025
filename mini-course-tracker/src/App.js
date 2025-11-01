import React, { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import NetworkSpeedIndicator from "./components/NetworkSpeedIndicator";

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const addCourse = (title) => {
    if (!title.trim()) return;
    setCourses([...courses, { id: Date.now(), title, progress: 0 }]);
  };

  const updateProgress = (id, progress) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, progress } : c))
    );
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, updateProgress, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

const useCourses = () => useContext(CourseContext);

const CourseInput = () => {
  const [title, setTitle] = useState("");
  const { addCourse } = useCourses();

  const handleAdd = () => {
    addCourse(title);
    setTitle("");
  };

  return (
    <div className="input-container">
      <input
        type="text"
        placeholder="Enter course name..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const { updateProgress, deleteCourse } = useCourses();

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <input
        type="range"
        min="0"
        max="100"
        value={course.progress}
        onChange={(e) => updateProgress(course.id, parseInt(e.target.value))}
      />
      <p>{course.progress}% completed</p>
      <button onClick={() => deleteCourse(course.id)}>Delete</button>
    </div>
  );
};

const CourseList = () => {
  const { courses } = useCourses();

  if (courses.length === 0)
    return <p className="empty">No courses yet. Add your first one!</p>;

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default function App() {
  return (
    <CourseProvider>
      <div className="App">
        <h1>🎓 Mini Course Tracker</h1>
        <CourseInput />
        <CourseList />
        <NetworkSpeedIndicator />
      </div>
    </CourseProvider>
  );
}
