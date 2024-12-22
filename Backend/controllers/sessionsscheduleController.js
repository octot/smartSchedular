
const Schedule= require("../models/sessionscheduleModel");
const createSchedule = async (req, res) => {
  try {
    const { tuitionId, tutorName, automate, totalDays, sessionDate } = req.body;

    // Create a new schedule
    const newSchedule = new Schedule({
      tuitionId,
      tutorName,
      automate,
      totalDays,
      sessionDate,
    });

    // Save to the database
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { tuitionId, tutorName, automate, totalDays, sessionDate } = req.body;

    // Find the schedule by ID and update
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { tuitionId, tutorName, automate, totalDays, sessionDate },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
