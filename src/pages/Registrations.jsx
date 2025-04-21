import { useState, useEffect } from "react";
import { getData, saveData } from "../services/localStorageService";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Registrations() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  const [filterType, setFilterType] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedOffering, setSelectedOffering] = useState("");

  // Load data on mount
  useEffect(() => {
    setCourseTypes(getData("courseTypes"));
    setOfferings(getData("offerings"));
    setRegistrations(getData("registrations"));
  }, []);

  // Register new student
  const handleRegister = (e) => {
    e.preventDefault();
    if (!studentName.trim() || selectedOffering === "") {
      setError("Student name and course offering are required.");
      return;
    }
    const exists = registrations.some(
      (r) =>
        r.studentName.trim().toLowerCase() ===
          studentName.trim().toLowerCase() &&
        r.offeringIdx === +selectedOffering
    );
    if (exists) {
      setError("This student is already registered for this offering.");
      return;
    }

    const newReg = {
      studentName: studentName.trim(),
      offeringIdx: +selectedOffering,
    };
    const updated = [...registrations, newReg];

    setRegistrations(updated);
    saveData("registrations", updated);

    setStudentName("");
    setSelectedOffering("");
    setError("");
  };

  // Unregister a student by its index in the registrations array
  const handleUnregister = (regIdx) => {
    const updated = registrations.filter((_, i) => i !== regIdx);
    setRegistrations(updated);
    saveData("registrations", updated);
  };

  // Filter offerings by course type if one is selected
  const visibleOfferings = filterType
    ? offerings
        .map((off, i) => ({ ...off, idx: i }))
        .filter((off) => off.courseType === filterType)
    : offerings.map((off, i) => ({ ...off, idx: i }));

  // Group registrations by offering index, keeping original reg index
  const regsByOffering = registrations
    .map((reg, regIdx) => ({ ...reg, regIdx }))
    .reduce((acc, reg) => {
      (acc[reg.offeringIdx] ??= []).push(reg);
      return acc;
    }, {});

  return (
    <div className="p-4" >
      <h2 className="my-1.5 pb-2">Student Registrations</h2>

      {/* Filter by Course Type */}
      <div className="flex items-center mb-2">
        <label>
          Filter by Course Type:{" "}
        </label>
          <FormControl sx={{ m: 1, minWidth: 160 }}>
        <InputLabel id="type-1">— All Types —</InputLabel>
        <Select
          labelId="type-1"
          id="select-type"
          value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
          autoWidth
          label="— All Types —"
        >
          <MenuItem value="">— All Types —</MenuItem>
              {courseTypes.map((ct, i) => (
                <MenuItem key={i} value={ct}>
                  {ct}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
      </div>

      {/* Registration Form */}
      <form className="flex md:items-center mb-2 flex-col md:flex-row" onSubmit={handleRegister}>
        <TextField
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          label="Student name"
          variant="outlined"
        />
        <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="offer">— Select Offering —</InputLabel>
        <Select
          value={selectedOffering}
          onChange={(e) => setSelectedOffering(e.target.value)}
          labelId="offer"
          id="offer-type"
          autoWidth
          label="— Select Offering —"
          >
          <MenuItem value="">— Select Offering —</MenuItem>
          {visibleOfferings.map((off) => (
            <MenuItem key={off.idx} value={off.idx}>
              {off.courseType} – {off.course}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        <Button size="large" variant="contained" type="submit">
          Register
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {/* Display Registered Students with Unregister Buttons */}
      {visibleOfferings.map((off) => {
        const regs = regsByOffering[off.idx] || [];
        return (
          <div key={off.idx} style={{ marginBottom: "1rem" }}>
            <strong>
              {off.courseType} – {off.course}
            </strong>
            {regs.length > 0 ? (
              <ul className="mt-0.5 px-1">
                {regs.map((reg) => (
                  <li key={reg.regIdx}>
                    <span className="text-2xl">{reg.studentName}</span>
                    <Button variant="outlined" color="error" size="small"
                      onClick={() => handleUnregister(reg.regIdx)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Unregister
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
                No registrations yet.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
