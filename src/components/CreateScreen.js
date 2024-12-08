// src/components/CreateScreen.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSession } from "../store/scheduleSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import "../componentcss/CreateScreen.css";
import {
  sessionTimes as initialSessionTimes,
  selectedDaysTrue,
  daysInWeek,
} from "./constants";
const CreateScreen = () => {
  const [totalDays, setTotalDays] = useState([]);
  const [formData, setFormData] = useState({
    tuitionId: "",
    tutorName: "",
    automate: false,
    totalDays: [],
    sessionDate: new Date().toISOString().split("T")[0], // Set current date as default
  });
  const [selectedDays, setSelectedDays] = useState({});
  const [sessionTimes, setSessionTimes] = useState(initialSessionTimes);
  const [commonSession, setCommonSession] = useState({
    sessionStartTime: "",
    sessionEndTime: "",
  });
  const [errors, setErrors] = useState({});
  const [useCommonSession, setUseCommonSession] = useState(false);
  const dispatch = useDispatch();
  const toggleDaySelection = (day) => {
    setSelectedDays((prev) => {
      const newState = { ...prev };
      if (newState[day]) {
        delete newState[day];
        setSessionTimes((prevTimes) => ({ ...prevTimes, [day]: {} }));
      } else {
        newState[day] = true;
      }
      return newState;
    });
  };
  const handleSessionChange = (day, field, value) => {
    setSessionTimes((prevTimes) => {
      const updatedTimes = {
        ...prevTimes,
        [day]: { ...prevTimes[day], [field]: value },
      };
      const startTime = updatedTimes[day].sessionStartTime;
      const endTime = updatedTimes[day].sessionEndTime;
      if (startTime && endTime && endTime < startTime) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [day]: `End time must be greater than start time`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [day]: "",
        }));
      }
      return updatedTimes;
    });
  };
  const handleSave = () => {
    const result = Object.keys(selectedDays).map((day) => ({
      day,
      sessionStartTime: useCommonSession
        ? commonSession.sessionStartTime
        : sessionTimes[day]?.sessionStartTime || "",
      sessionEndTime: useCommonSession
        ? commonSession.sessionEndTime
        : sessionTimes[day]?.sessionEndTime || "",
    }));
    console.log("Saved Data:", result);
    setTotalDays(result);
    setFormData({
      ...formData,
      totalDays: totalDays,
    });
    console.log("totalDays:", totalDays);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSession(formData));
    console.log("Saved Data formData:", formData);
    setFormData({
      tuitionId: "",
      tutorName: "",
      automate: false,
      totalDays: [],
      sessionDate: new Date().toISOString().split("T")[0],
    });
    setSessionTimes({});
    setSelectedDays({});
    setCommonSession({});
    setUseCommonSession(false);
  };
  const handleCheckboxChange = (checked) => {
    setUseCommonSession(checked);
    if (checked) {
      setSelectedDays(selectedDaysTrue); // Select both days when common session is enabled
    }
  };
  const handleCommonSession = (field) => (e) => {
    const value = e.target.value;
    setCommonSession((prev) => {
      const updatedSession = { ...prev, [field]: value };
      if (field === "sessionEndTime" && updatedSession.sessionStartTime) {
        if (updatedSession.sessionStartTime >= value) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            sessionEndTime: "End time must be greater than start time.",
          }));
        } else {
          setErrors((prevErrors) => {
            const { sessionEndTime, ...rest } = prevErrors;
            return rest;
          });
        }
      }
      return updatedSession;
    });
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log("formData", formData);
  return (
    <div>
      <Box className="schedule-main">
        <Typography variant="h4" component="h2" gutterBottom>
          Create Schedule
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Tuition ID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tuition ID"
                name="tuitionId"
                value={formData.tuitionId}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Tutor Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tutor Name"
                name="tutorName"
                value={formData.tutorName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Session Date"
                name="sessionDate"
                value={formData.sessionDate}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Automate Checkbox */}

            <Grid item xs={12} sm={6}>
              {/* Button to open the dialog */}
              <Button variant="outlined" onClick={handleOpen}>
                Select Days
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="automate"
                    checked={formData.automate}
                    onChange={handleChange}
                  />
                }
                label="Automate"
              />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create
              </Button>
            </Grid>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Select Days</DialogTitle>
            <DialogContent>
              <div className="days-grid-main">
                <div className="days-grid-elements">
                  {daysInWeek.map((day) => (
                    <div
                      key={day}
                      onClick={() => toggleDaySelection(day)}
                      style={{
                        width: "50px",
                        height: "50px",
                        lineHeight: "50px",
                        textAlign: "center",
                        border: "1px solid black",
                        backgroundColor: selectedDays[day]
                          ? "green"
                          : "transparent",
                        color: selectedDays[day] ? "white" : "black",
                        cursor: "pointer",
                      }}
                    >
                      {day.toUpperCase()}
                    </div>
                  ))}
                </div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useCommonSession}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                    />
                  }
                  label="Use Common Session"
                />
                {useCommonSession ? (
                  <div>
                    <Box component="div" className="common-session">
                      <label>
                        <TextField
                          fullWidth
                          type="time"
                          label=" CommonStartTime"
                          value={commonSession.sessionStartTime}
                          onChange={handleCommonSession("sessionStartTime")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </label>
                      <label>
                        <TextField
                          fullWidth
                          label=" Common End Time"
                          type="time"
                          value={commonSession.sessionEndTime}
                          onChange={handleCommonSession("sessionEndTime")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!errors.sessionEndTime}
                          helperText={errors.sessionEndTime}
                        />
                      </label>
                    </Box>
                  </div>
                ) : (
                  <div>
                    {daysInWeek.map(
                      (day) =>
                        selectedDays[day] && (
                          <div key={day}>
                            <h4>{day.toUpperCase()} Session Times</h4>
                            <Box component="div" className="session-time">
                              <label>
                                <TextField
                                  label="Start Time"
                                  type="time"
                                  value={
                                    sessionTimes[day]?.sessionStartTime || ""
                                  }
                                  onChange={(e) =>
                                    handleSessionChange(
                                      day,
                                      "sessionStartTime",
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </label>
                              <label>
                                <TextField
                                  label="End Time"
                                  type="time"
                                  value={
                                    sessionTimes[day]?.sessionEndTime || ""
                                  }
                                  onChange={(e) =>
                                    handleSessionChange(
                                      day,
                                      "sessionEndTime",
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  error={!!errors[day]}
                                  helperText={errors[day]}
                                />
                              </label>
                            </Box>
                          </div>
                        )
                    )}
                  </div>
                )}
                <Button onClick={handleSave}>Save</Button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Box>
    </div>
  );
};

export default CreateScreen;
