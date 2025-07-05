// MCPFrontend.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function MCPFrontend() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [thread, setThread] = useState("");
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState("polite");
  const [goal, setGoal] = useState("");
  const [style, setStyle] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({});
  const [followUpResponse, setFollowUpResponse] = useState(null);


    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // auto scheduling meeting

  const [to, setTo] = useState('');
  const [sub, setSub] = useState('');
  const [body, setBody] = useState('');
  const [modal, setModal] = useState(false);

  const handleDraft = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/email/draft-email", {
        thread,
        intent,
        tone,
        senderStyle: style,
        userGoal: goal,
      });
      setDraft(res.data.draft);
    } catch (err) {
      alert("Error generating draft");
    }
    setLoading(false);
  };

  const handleMeetingSchedule = async () => {
    try {
      const obj = {
        to: to,
        subject: sub,
        body: body
      }
      const res = await axios.post("http://localhost:5000/api/email/schedule-meeting", obj);
      setMeetingInfo(res.data);
    } catch (err) {
      alert("Meeting scheduling failed");
    }
  };

  const openModal= ()=>{
    setModal(true);
  }

  const handleFollowUp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/email/follow-up-schedule", {
        thread,
      });
      setFollowUpResponse(res.data);
    } catch (err) {
      alert("Follow-up scheduling failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-start">
      <h1 className="text-2xl font-bold px-5">MCP Email Copilot</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
         onClick={()=>navigate('/dashboard')}
        >
          MCP Dashboard
        </button>
      </div>

      <textarea
        placeholder="Paste email thread here..."
        className="w-full border p-3 rounded"
        rows={6}
        value={thread}
        onChange={(e) => setThread(e.target.value)}
      />

      <input
        type="text"
        placeholder="Your intent (e.g., follow up)"
        className="w-full border p-3 rounded"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
      />

      <input
        type="text"
        placeholder="Your goal (e.g., close by Friday)"
        className="w-full border p-3 rounded"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <input
        type="text"
        placeholder="Your writing style (e.g., direct, warm)"
        className="w-full border p-3 rounded"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      />

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full border p-3 rounded"
      >
        <option value="polite">Polite</option>
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="urgent">Urgent</option>
      </select>

      {/* Dialog Auto scheduling meeting */}
       <Dialog
        fullScreen={fullScreen}
        open={modal}
        onClose={()=>setModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Auto Scheduling Meeting Calendar
        </DialogTitle>
        <DialogContent>
          
      {/* auto scheduling */}
        <input
          type="text"
          placeholder="To:"
          className="w-full border p-3 rounded m-2"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

      <input
          type="text"
          placeholder="Subject"
          className="w-full border p-3 rounded m-2"
          value={sub}
          onChange={(e) => setSub(e.target.value)}
        />

      <input
          type="text"
          placeholder="Body"
          className="w-full border p-3 rounded m-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        </DialogContent>
        <DialogActions>
          <button autoFocus onClick={()=>setModal(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleMeetingSchedule} autoFocus>
            Submit
          </button>
        </DialogActions>
      </Dialog>
  
      <div className="flex gap-3">
        <button
          onClick={handleDraft}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Draft"}
        </button>

        <button
          onClick={handleFollowUp}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 opacity-50 cursor-not-allowed"
        >
          Schedule Follow-Up
        </button>

        <button
          onClick={openModal}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Auto-Schedule Meeting
        </button>
      </div>

      {draft && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Draft:</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{draft}</pre>
        </div>
      )}

      {followUpResponse && (
        <div className="mt-6 bg-green-50 p-4 rounded">
          <h2 className="text-lg font-semibold">Follow-Up Scheduled</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(followUpResponse, null, 2)}</pre>
        </div>
      )}

      {meetingInfo.link && (
        <div className="mt-6 bg-purple-50 p-4 rounded">
          <h2 className="text-lg font-semibold">Meeting Scheduled</h2>
          <p><strong>Link:</strong> <a href={meetingInfo.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{meetingInfo.link}</a></p>
          <p><strong>Time:</strong> {meetingInfo.time}</p>
          <p><strong>Agenda:</strong> {meetingInfo.agenda}</p>
        </div>
      )}
    </div>
  );
}
