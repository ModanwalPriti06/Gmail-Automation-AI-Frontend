// DashboardView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardView() {
  const [followUps, setFollowUps] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
     const token = localStorage.getItem("token");

      const [followUpRes, meetingRes, draftRes] = await Promise.all([
        axios.get("http://localhost:5000/api/email/followups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        // Add more calls here when needed:
        // axios.get("http://localhost:5000/api/email/meetings", { headers: { Authorization: `Bearer ${token}` } }),
        // axios.get("http://localhost:5000/api/email/draft-email", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
        setFollowUps(followUpRes.data || []);
        // setMeetings(meetingRes.data || []);
        // setDrafts(draftRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 MCP Dashboard</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">⏳ Follow-Up Emails</h2>
        <ul className="bg-green-100 rounded p-4 space-y-2">
          {followUps?.map((f, idx) => (
            <li key={idx} className="p-2 border rounded">
              <strong>Status:</strong> {f?.status} <br />
              <strong>To:</strong> {f?.to} <br />
              <strong>Message:</strong> {f?.subject.slice(0, 100)}...
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
