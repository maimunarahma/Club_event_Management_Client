# 🎉 Event Management Client

This is the **frontend (client-side)** of the Event Management Web Application. It enables users from different universities and clubs to **view, manage, and register** for various events. Built using **React.js**, it includes role-based views for **students**, **club admins**, and **event managers**.

---

## 🔗 Live Website

👉 [Visit the Event Portal](https://your-client-url.vercel.app)

---

## 🚀 Features

- 🔍 Browse upcoming events with details (type, location, date, prize, etc.)
- 🔐 Role-based dashboard: Student | Club Admin | Event Manager
- 📅 Club Admin can update event status (Pending/Accepted)
- 🏫 View club and university information related to each event
- 🔗 External registration links
- ✨ Clean, responsive design with Tailwind CSS
- 🛡️ Authentication via Firebase

---

## 🧰 Tech Stack

| Frontend | Description          |
|----------|----------------------|
| React.js | Frontend framework   |
| Axios    | API data fetching    |
| Tailwind | CSS utility framework|
| SweetAlert2 | Confirmation Modals |
| React Router | Routing and navigation |

---

## 📁 Folder Structure

```bash
event-client/
│
├── public/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main views (e.g., Event.js)
│   ├── providers/         # Contexts like Authentication
│   ├── App.jsx            # Main App
│   └── main.jsx           # Entry Point
│
├── .env                   # Environment variables
├── package.json
└── README.md
