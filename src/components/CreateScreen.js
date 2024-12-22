// src/components/CreateScreen.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useSession,
  SessionProvider,
} from "./contextAPI/sessionManagementContext";
import { addSession } from "./store/scheduleSlice";
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
import axios from "axios";

import { sessionTimes, selectedDaysTrue, daysInWeek } from "./constants";
const CreateScreen = () => {
  return (
    <SessionProvider>
      <CreateNewScreen />
    </SessionProvider>
  );
};
const CreateNewScreen = () => {
  const { state, dispatch } = useSession();
  const reduxDispatch = useDispatch();

  const toggleDaySelection = (day) => {
    dispatch({ type: "TOGGLE_DAY", payload: day });
  };

  const handleSessionChange = (day, field, value) => {
    dispatch({
      type: "UPDATE_SESSION_TIME",
      payload: { day, field, value },
    });
  };
  const handleSave = () => {
    dispatch({ type: "SAVE_DAYS" });
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: "UPDATE_FORM",
      payload: { name, value, type, checked },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.formData),
      });
      if (!response.ok) {
        console.error(response);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Server Response", data);
      reduxDispatch(addSession(state.formData));
      console.log("Form Data", state.formData);
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCheckboxChange = (checked) => {
    dispatch({
      type: "TOGGLE_COMMON_SESSION",
      payload: { checked, selectedDaysTrue },
    });
  };
  const handleCommonSession = (field) => (e) => {
    dispatch({
      type: "UPDATE_COMMON_SESSION",
      payload: { field, value: e.target.value },
    });
  };
  const handleOpen = () => dispatch({ type: "TOGGLE_MODAL", payload: true });
  const handleClose = () => dispatch({ type: "TOGGLE_MODAL", payload: false });
  console.log("fromsession", sessionTimes);
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
                value={state.formData.tuitionId}
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
                value={state.formData.tutorName}
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
                value={state.formData.sessionDate}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Automate Checkbox */}

            <Grid item xs={12} sm={6}>
              <Button variant="outlined" onClick={handleOpen}>
                Select Days
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="automate"
                    checked={state.formData.automate}
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
          <Dialog open={state.open} onClose={handleClose}>
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
                        backgroundColor: state.selectedDays[day]
                          ? "green"
                          : "transparent",
                        color: state.selectedDays[day] ? "white" : "black",
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
                      checked={state.useCommonSession}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                    />
                  }
                  label="Use Common Session"
                />
                {state.useCommonSession ? (
                  <div>
                    <Box component="div" className="common-session">
                      <label>
                        <TextField
                          fullWidth
                          type="time"
                          label=" CommonStartTime"
                          value={state.commonSession.sessionStartTime}
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
                          value={state.commonSession.sessionEndTime}
                          onChange={handleCommonSession("sessionEndTime")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!state.errors.sessionEndTime}
                          helperText={state.errors.sessionEndTime}
                        />
                      </label>
                    </Box>
                  </div>
                ) : (
                  <div>
                    {daysInWeek.map(
                      (day) =>
                        state.selectedDays[day] && (
                          <div key={day}>
                            <h4>{day.toUpperCase()} Session Times</h4>
                            <Box component="div" className="session-time">
                              <label>
                                <TextField
                                  label="Start Time"
                                  type="time"
                                  value={
                                    state.sessionTimes[day]?.sessionStartTime ||
                                    ""
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
                                    state.sessionTimes[day]?.sessionEndTime ||
                                    ""
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
                                  error={!!state.errors[day]}
                                  helperText={state.errors[day]}
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
