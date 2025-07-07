# Solution for handling project

## PART 1: Intelligent Follow-up System (Backend Only)

### Overview of What We’ll Build in Part 1
- We are building an automated email follow-up system that:
- Connects to Gmail API
- Reads sent emails
- Detects if the recipient was supposed to respond
- Schedules a follow-up only if we are waiting on them
- Generates context-aware follow-up emails
- Follows up within business hours (10AM–7PM)
- Uses a free LLM (AI) to analyze context (like Together.ai)

### Tech Stack
- Node.js
- Express.js
- MongoDB (for storing follow-up schedules, logs)
- Gmail API (to send/read emails)
- Together.ai or other LLM (for email context analysis)
- Node-cron (to schedule follow-ups)

## ✅ TODAY’S TASK: Project Setup & Gmail API Connection
1. Setup Node.js Project
2. Setup .env File
3. Basic Express Server
4. Connect Gmail API (OAuth2 Setup)
     - Go to: https://console.cloud.google.com
     - Click “Create Project”, Name: Gmail Workflow MCP
     - After creating, select the project from the dropdown.
5. Enable Gmail API
  - In the left sidebar, go to APIs & Services > Library
  - Search for Gmail API
  - Click it → Click Enable
6. Set Up OAuth 2.0 Credentials
7. Generate Refresh Token - Visit: https://developers.google.com/oauthplayground
8. Sending and Reading Emails Using Gmail API in Node.js
9. Send Email via Gmail API
10. Create ALl Route
11. Add Route to index.js
    
## Testing

1. Email sent successfully
```
POST http://localhost:5000/api/email/send

{
  "to": "recipient@example.com",
  "subject": "Test Follow-up",
  "message": "Hello, this is a test email from Gmail MCP automation system."
}
```

12. Read Sent Emails (to Detect Follow-Up Dependencies)
    
## Test Sent Email Reading
```
GET http://localhost:5000/api/email/sent

//You should see something like:
{
  "emails": [
    {
      "to": "abc@example.com",
      "subject": "Follow-up",
      "date": "Wed, 3 Jul 2025 10:25:00 +0530",
      "snippet": "Hey, just following up on our last..."
    },
    ...
  ]
}

```

13. Follow-up Detection & Smart Scheduling
14. Set Up MongoDB Model
15. Update Sent Email Controller to Track Follow-Ups
16. Schedule Follow-Ups
17. Implement Cron

## Test:
1. Send an email
2. It stores in FollowUp collection
3. Wait 24 hours (or change to 1 hour for testing)
4. Cron job sends a follow-up and updates DB

18. Detect Replies from Recipients (Mark Follow-up as Done)
19. Add Reply Detection Logic - checkReplies.js

## Test End-to-End
1. Send an email using your API.
2. It stores in MongoDB.
3. Simulate a reply to that email (manually reply from another Gmail).
4. Wait 1 minute for cron to run.
5. MongoDB follow-up entry should become:
```
"status": "replied"
```
6. No further follow-ups will be sent for that thread.

20. BONUS: Want to view all follow-ups? /followups
```
✔ Sending email
✔ Saving sent thread
✔ Scheduling follow-ups with increasing urgency
✔ Detecting replies
✔ Marking follow-up complete
```

21. Intelligent Meeting Scheduling via Google Calendar API
  - Enable Google Calendar API
  - Utility Function for Calendar Availability
  - Endpoint to Auto-Schedule Meeting

## Test - API Request (POST)
```
POST /schedule-meeting
Content-Type: application/json

{
  "to": "prospect@example.com",
  "subject": "Follow-up discussion",
  "body": "Hi, can we schedule a call to discuss the proposal?"
}
```
### Expected Result:
- ✅ Detects intent
- ✅ Checks calendar
- ✅ Finds first available 1-hour slot between 10am-7pm
- ✅ Schedules meeting via Google Calendar
- ✅ Sends back meeting link & details

22. Use LLM to Detect Intent + Generate Agenda
23. Update /schedule-meeting API to Use LLM
```
// BONUS: Suggest Alternative Time Slots

if (slots.length === 0) {
  const nextDaySlots = await getFreeSlots(new Date(Date.now() + 24 * 60 * 60 * 1000));
  return res.status(400).json({
    message: "No free slots today. Suggesting alternatives.",
    suggestions: nextDaySlots.slice(0, 3),
  });
}

```
24. Context-Aware Response

## Feature Buld
| Feature                     | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Thread Analysis**         | Parses previous emails to understand context (last sender, last action)      |
| **Tone Matching**           | Detects current urgency level and tailors tone accordingly (polite → urgent) |
| **Auto-Reply Generation**   | Drafts full reply content based on history                                   |
| **Manual/Auto Send Option** | (Optional) Allow review before sending                                       |

## Tech Stack
| Component       | Stack                             |
| --------------- | --------------------------------- |
| Email Analysis  | LLM (Together.ai, OpenRouter)     |
| Tone Escalation | Simple stage tracker per email ID |
| Auto Email Send | Gmail API                         |

25. Design Tone Escalation Engine
26. Draft Context-Aware Email
27. API Endpoint – /generate-context-reply

## Testing - /generate-context-reply
```
/generate-context-reply

{
  "thread": "From: client@example.com\nHey, just wondering when we’ll have that pricing doc?\n\nFrom: you@example.com\nSure, will send it soon.",
  "threadId": "xyz123",
  "followUpCount": 2
}
```
28. API Endpoint – /dependency-check
29. Integrate with Follow-up Scheduler
    
## AI Email Copilot (🔄 Claude / LLM Integration)
- Overview of AI Email Copilot
| Feature                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| 📝 Draft Emails           | Generate full reply drafts using prior conversation |
| 🧠 Understand Tone        | Match user's previous tone and email style          |
| 📂 Use Templates          | Auto-fill standard responses using variables        |
| 👀 Review Mode            | Show draft first; only send after approval          |
| ✅ Confirmation & Tracking | Log what's sent + allow edit before finalizing      |

30. Define Email Templates with Dynamic Variables
31. Replace Template Variables
32. AI Draft Generator from Email Thread
33. Endpoint – /draft-email
34. Integrate Review UI (MERN)
```
Request
{
  "thread": "From: john@client.com\nWe’re interested in the updated pricing.\n\nFrom: you@example.com\nSure, I’ll send it today.",
  "intent": "send updated pricing document",
  "tone": "professional",
  "senderStyle": "short, polite, direct",
  "userGoal": "close the deal by Friday"
}
Response
{
  "draft": "Hi John,\n\nThanks for your interest. Please find attached the updated pricing document as promised. Let me know if you have any questions. Looking forward to your feedback by Friday.\n\nBest regards,\n[Your Name]"
}
```
# Test All 
| Endpoint                             | Purpose                      |
| ------------------------------------ | ---------------------------- |
| `POST /api/email/dependency-check`   | Detect YOU vs THEM waiting   |
| `POST /api/email/follow-up-schedule` | Trigger follow-up logic      |
| `POST /api/email/schedule-meeting`   | Auto calendar meeting setup  |
| `POST /api/email/generate-response`  | Context-aware email          |
| `POST /api/email/draft-email`        | Copilot LLM draft generation |

35. Complete frontend part.





