// SessionContext.js
import React, { createContext, useContext, useReducer } from "react";

const SessionContext = createContext();

const initialState = {
  totalDays: [],
  formData: {
    tuitionId: "",
    tutorName: "",
    automate: false,
    totalDays: [],
    sessionDate: new Date().toISOString().split("T")[0],
  },
  selectedDays: {},
  sessionTimes: {},
  commonSession: {
    sessionStartTime: "",
    sessionEndTime: "",
  },
  errors: {},
  useCommonSession: false,
  open: false,
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_DAY":
      const day = action.payload;
      const newSelectedDays = { ...state.selectedDays };
      const newSessionTimes = { ...state.sessionTimes };
      console.log("newSelectedDays", newSelectedDays);
      console.log("newSessionTimes", newSessionTimes);
      if (newSelectedDays[day]) {
        delete newSelectedDays[day];
        delete newSessionTimes[day];
      } else {
        newSelectedDays[day] = true;
      }

      return {
        ...state,
        selectedDays: newSelectedDays,
        sessionTimes: newSessionTimes,
      };

    case "UPDATE_SESSION_TIME":
      const { day: timeDay, field, value } = action.payload;
      const updatedTimes = {
        ...state.sessionTimes,
        [timeDay]: { ...state.sessionTimes[timeDay], [field]: value },
      };

      let newErrors = { ...state.errors };
      const startTime = updatedTimes[timeDay].sessionStartTime;
      const endTime = updatedTimes[timeDay].sessionEndTime;

      if (startTime && endTime && endTime < startTime) {
        newErrors[timeDay] = "End time must be greater than start time";
      } else {
        delete newErrors[timeDay];
      }
      console.log("updatedTimes", updatedTimes);
      return {
        ...state,
        sessionTimes: updatedTimes,
        errors: newErrors,
      };

    case "SAVE_DAYS":
      const result = Object.keys(state.selectedDays).map((d) => ({
        day: d,
        sessionStartTime: state.useCommonSession
          ? state.commonSession.sessionStartTime
          : state.sessionTimes[d]?.sessionStartTime || "",
        sessionEndTime: state.useCommonSession
          ? state.commonSession.sessionEndTime
          : state.sessionTimes[d]?.sessionEndTime || "",
      }));

      return {
        ...state,
        totalDays: result,
        formData: {
          ...state.formData,
          totalDays: result,
        },
      };

    case "UPDATE_FORM":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]:
            action.payload.type === "checkbox"
              ? action.payload.checked
              : action.payload.value,
        },
      };

    case "RESET_FORM":
      return {
        ...state,
        formData: initialState.formData,
        sessionTimes: {},
        selectedDays: {},
        commonSession: initialState.commonSession,
        useCommonSession: false,
      };

    case "TOGGLE_COMMON_SESSION":
      return {
        ...state,
        useCommonSession: action.payload.checked,
        selectedDays: action.payload.checked
          ? action.payload.selectedDaysTrue
          : {},
      };

    case "UPDATE_COMMON_SESSION":
      const updatedCommonSession = {
        ...state.commonSession,
        [action.payload.field]: action.payload.value,
      };

      let commonSessionErrors = { ...state.errors };
      if (
        action.payload.field === "sessionEndTime" &&
        updatedCommonSession.sessionStartTime >= action.payload.value
      ) {
        commonSessionErrors.sessionEndTime =
          "End time must be greater than start time.";
      } else {
        delete commonSessionErrors.sessionEndTime;
      }

      return {
        ...state,
        commonSession: updatedCommonSession,
        errors: commonSessionErrors,
      };

    case "TOGGLE_MODAL":
      return {
        ...state,
        open: action.payload,
      };

    default:
      return state;
  }
};

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
