import { useState, useEffect } from "react";
import { getData, saveData } from "../services/localStorageService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

export default function CourseTypes() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCourseTypes(getData("courseTypes"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) {
      setError("Course type name cannot be empty.");
      return;
    }
    const exists = courseTypes.some(
      (type, i) => i !== editIndex && type.toLowerCase() === input.toLowerCase()
    );
    if (exists) {
      setError("This course type already exists.");
      return;
    }
    const updated = [...courseTypes];
    if (editIndex !== null) {
      updated[editIndex] = input.trim();
      setEditIndex(null);
    } else {
      updated.push(input.trim());
    }

    setCourseTypes(updated);
    saveData("courseTypes", updated);
    setInput("");
    setError("");
  };

  const handleEdit = (index) => {
    setInput(courseTypes[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = courseTypes.filter((_, i) => i !== index);
    setCourseTypes(updated);
    saveData("courseTypes", updated);
  };

  return (
    <div className="p-4">
      <h2 className="my-1.5 pb-2">Course Types</h2>
      <form className="flex items-center my-1.5 gap-1" onSubmit={handleSubmit}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label="Enter course type"
          variant="outlined"
        />
        <Button size="large" variant="contained" type="submit">
          {editIndex !== null ? "Update" : "Add"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <ul className="flex flex-col gap-1.5 m-1">
        {courseTypes.map((type, index) => (
          <li className="flex gap-1.5 items-center" key={index}>
            {type}
            <IconButton size="small" onClick={() => handleEdit(index)}>✏️</IconButton>
            <IconButton size="small" onClick={() => handleDelete(index)}>🗑️</IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
