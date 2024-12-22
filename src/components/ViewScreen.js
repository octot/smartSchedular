import React, { useEffect, useState } from "react";
import axios from "axios";
import "../componentcss/ViewScreen.css";
const ViewScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedules from the API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("/api/schedules"); // Updated API endpoint to localhost:5000
        setSchedules(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);
  return (
    <div>
      <h1>Schedule Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Tuition ID</th>
              <th>Tutor Name</th>
              <th>Automate</th>
              <th>Session Date</th>
              <th>Total Days</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.tuitionId}</td>
                <td>{schedule.tutorName}</td>
                <td>{schedule.automate ? "Yes" : "No"}</td>
                <td>{schedule.sessionDate}</td>
                <td>
                  <ul>
                    {schedule.totalDays.map((day, index) => (
                      <li key={index}>
                        {day.day} - {day.sessionStartTime} to{" "}
                        {day.sessionEndTime}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ViewScreen;
