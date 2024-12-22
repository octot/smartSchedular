const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema({
  tuitionId: {
    type: String,
    required: true,
    trim: true,
  },
  tutorName: {
    type: String,
    required: true,
    trim: true,
  },
  automate: {
    type: Boolean,
    default: false,
  },
  totalDays: {
    type: [
      {
        day: {
          type: String, // e.g., "Monday"
          required: true,
        },
        sessionStartTime: {
          type: String, // e.g., "09:00 AM"
          required: true,
        },
        sessionEndTime: {
          type: String, // e.g., "10:00 AM"
          required: true,
        },
      },
    ],
    default: [], // Default to an empty array
  },
  sessionDate: {
    type: String, // Use ISO date format as a string
    required: true,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
