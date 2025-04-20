import { useState, useEffect } from "react";
import { getData, saveData } from "../services/localStorageService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  // Load existing courses on mount
  useEffect(() => {
    setCourses(getData("courses"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = input.trim();
    if (!name) {
      setError("Course name cannot be empty.");
      return;
    }
    const exists = courses.some(
      (course, i) =>
        i !== editIndex && course.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setError("This course already exists.");
      return;
    }
    const updated = [...courses];
    if (editIndex !== null) {
      updated[editIndex] = name;
      setEditIndex(null);
    } else {
      updated.push(name);
    }

    setCourses(updated);
    saveData("courses", updated);
    setInput("");
    setError("");
  };

  const handleEdit = (index) => {
    setInput(courses[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    saveData("courses", updated);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 className="my-1.5 pb-2">Courses</h2>
      <form className="flex items-center my-1.5 gap-1" onSubmit={handleSubmit}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label="Enter course name"
          variant="outlined"
        />
        <Button size="large" variant="contained" type="submit">{editIndex !== null ? "Update" : "Add"}</Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <ul className="flex flex-col gap-1.5 m-1">
        {courses.map((course, index) => (
          <li className="flex gap-1.5 items-center" key={index}>
          {course}
          <IconButton size="small" onClick={() => handleEdit(index)}>✏️</IconButton>
          <IconButton size="small" onClick={() => handleDelete(index)}>🗑️</IconButton>
        </li>
        ))}
      </ul>
    </div>
  );
}
