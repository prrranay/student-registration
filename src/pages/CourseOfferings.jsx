import { useState, useEffect } from "react";
import { getData, saveData } from "../services/localStorageService";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export default function CourseOfferings() {
  const [offerings, setOfferings] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  // Load existing data on mount
  useEffect(() => {
    setCourseTypes(getData("courseTypes"));
    setCourses(getData("courses"));
    setOfferings(getData("offerings"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType || !selectedCourse) {
      setError("Both fields are required.");
      return;
    }

    const exists = offerings.some(
      (off, i) =>
        i !== editIndex &&
        off.courseType === selectedType &&
        off.course === selectedCourse
    );
    if (exists) {
      setError("This course offering already exists.");
      return;
    }
    const newOffering = { courseType: selectedType, course: selectedCourse };
    const updated = [...offerings];

    if (editIndex !== null) {
      updated[editIndex] = newOffering;
      setEditIndex(null);
    } else {
      updated.push(newOffering);
    }

    setOfferings(updated);
    saveData("offerings", updated);
    setSelectedType("");
    setSelectedCourse("");
    setError("");
  };

  const handleEdit = (idx) => {
    const off = offerings[idx];
    setSelectedType(off.courseType);
    setSelectedCourse(off.course);
    setEditIndex(idx);
  };

  const handleDelete = (idx) => {
    const updated = offerings.filter((_, i) => i !== idx);
    setOfferings(updated);
    saveData("offerings", updated);
  };

  return (
    <div className="p-4">
      <h2 className="my-1.5 pb-2">Course Offerings</h2>

      <form className="flex md:items-center flex-col md:flex-row mb-2" onSubmit={handleSubmit}>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
      <InputLabel id="course-type">- Select Course Type -</InputLabel>
        <Select
          labelId="course-type"
          id="demo-simple-select-autowidth"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          autoWidth
          label="-- Select Course Type --"
        >
          <MenuItem value="">-- Select Course Type --</MenuItem>
          {courseTypes.map((ct, i) => (
            <MenuItem key={i} value={ct}>
              {ct}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="course">- Select Course -</InputLabel>
        <Select
          labelId="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          autoWidth
          label=">-- Select Course --"
          >
          <MenuItem value="">-- Select Course --</MenuItem>
          {courses.map((c, i) => (
            <MenuItem key={i} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
        </FormControl>

        <Button size="large" variant="contained" type="submit" style={{ marginLeft: "0.5rem" }}>
          {editIndex !== null ? "Update" : "Add"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <ul>
        {offerings.map((off, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>
            {off.courseType} – {off.course}
            <IconButton size="small"
              onClick={() => handleEdit(i)}
              style={{ marginLeft: "0.5rem" }}
            >
              ✏️
            </IconButton>
            <IconButton size="small"
              onClick={() => handleDelete(i)}
              style={{ marginLeft: "0.25rem" }}
            >
              🗑️
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
