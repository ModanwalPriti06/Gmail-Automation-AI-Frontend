// MCPFrontend.jsx
import React, { useState } from "react";
import axios from "axios";

export default function MCPFrontend() {
  const [thread, setThread] = useState("");
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState("polite");
  const [goal, setGoal] = useState("");
  const [style, setStyle] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">MCP Email Copilot</h1>

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

      <button
        onClick={handleDraft}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Draft"}
      </button>

      {draft && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Draft:</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{draft}</pre>
        </div>
      )}
    </div>
  );
}
