<div align="center">

# 🚀 WorkPlus — Employee Management System

**A full-stack MERN platform that handles attendance, leave, payroll and automated reminders, so HR doesn't have to chase anyone.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-6366f1?style=for-the-badge)](https://employee-management-system-jade-gamma.vercel.app/)
[![MERN](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge)](#-tech-stack)
[![Inngest](https://img.shields.io/badge/Workflows-Inngest-000000?style=for-the-badge)](https://www.inngest.com/)
[![Brevo](https://img.shields.io/badge/Email-Brevo-0092ff?style=for-the-badge)](https://www.brevo.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

[**Live Demo**](https://employee-management-system-jade-gamma.vercel.app/) · [**Report Bug**](https://github.com/Saquib-Anjum/Employee-Management-System/issues) · [**Request Feature**](https://github.com/Saquib-Anjum/Employee-Management-System/issues)

</div>

---

## ✨ Overview

**WorkPlus** is a modern Employee Management System built on the MERN stack. Employees clock in and out, apply for leave and view payslips. Admins manage the workforce from a single dashboard. Background jobs powered by **Inngest** and transactional emails sent through **Brevo** keep everyone on track automatically.

> 🎯 Built to replace spreadsheets and manual follow-ups with durable, event-driven automation.

---

## 🔥 Features

### 👤 Employee
- ⏱️ **One-tap Clock In / Clock Out** with automatic Late / Present status
- 📊 **Working-hours calculation** with day-type classification (Full Day, Three Quarter, Half Day, Short Day)
- 🌴 **Leave applications** with live status tracking
- 💸 **Payslips** available on demand
- 🧑‍💼 **Profile management**
- 🕒 **Attendance history** at a glance

### 🛡️ Admin
- 👥 **Employee management** (create, update, deactivate)
- 📈 **Dashboard** with workforce insights
- ✅ **Approve or reject leave** requests
- 💰 **Payslip management**
- 📬 **Automatic reminders** for pending approvals

### 🤖 Smart Automation (Inngest)

| Workflow | Trigger | What it does |
|---|---|---|
| **Auto Check-Out** | `employee/check-out` | Sends a reminder email if you forget to check out, then auto-closes the attendance record after the grace period |
| **Leave Reminder** | `leave/pending` | Emails the admin if a leave request sits pending for 24 hours |
| **Attendance Reminder** | Cron, `11:30 AM IST` daily | Emails active employees who haven't checked in and aren't on approved leave |

Workflows are **durable**: sleeps, retries and replays are handled by Inngest, with no cron servers to babysit.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **Background Jobs** | Inngest |
| **Email** | Brevo (SMTP via Nodemailer) |
| **Deployment** | Vercel |

---

## 🏗️ Architecture

```
┌──────────────┐      REST API      ┌──────────────────┐      ┌───────────┐
│   React UI   │ ─────────────────► │  Express Server  │ ───► │  MongoDB  │
└──────────────┘                    └────────┬─────────┘      └───────────┘
                                             │
                              inngest.send() │  /api/inngest
                                             ▼
                                    ┌──────────────────┐   emails   ┌─────────┐
                                    │ Inngest Workflows│ ─────────► │  Brevo  │
                                    └──────────────────┘            └─────────┘
```

---

## 📁 Project Structure

```
Employee-Management-System/
├── backend/
│   ├── config/          # DB + mailer configuration
│   ├── controllers/     # Route handlers
│   ├── inngest/         # Inngest client + workflow functions
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── app.js           # Express app (exported for Vercel)
│   └── server.js        # Local dev entry point
└── frontend/            # React client
```

---

## 🔌 API Routes

| Route | Description |
|---|---|
| `/api/auth` | Authentication |
| `/api/employees` | Employee management |
| `/api/profile` | Employee profile |
| `/api/attendance` | Clock in/out and history |
| `/api/leave` | Leave applications |
| `/api/payslips` | Payslips |
| `/api/dashboard` | Dashboard stats |
| `/api/inngest` | Inngest workflow endpoint |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (Atlas or local)
- A [Brevo](https://www.brevo.com/) account (SMTP credentials)
- An [Inngest](https://www.inngest.com/) account (or the Inngest Dev Server for local use)

### 1. Clone the repo
```bash
git clone https://github.com/Saquib-Anjum/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Email (Brevo SMTP)
SMTP_USER=your_brevo_smtp_login
SMTP_PASS=your_brevo_smtp_key
SENDER_EMAIL=your_verified_sender_email
ADMIN_EMAIL=admin@example.com
```

> Adjust the email variable names to match your `config/nodemailer.js`.

Start the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Run Inngest locally (optional)
```bash
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
```
Open the dashboard at `http://localhost:8288` to trigger and inspect workflows.

---


---



## 🗺️ Roadmap

- [ ] Role-based permission levels
- [ ] Export attendance and payroll reports (CSV / PDF)
- [ ] Holiday calendar integration
- [ ] Shift management
- [ ] In-app notifications

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Saquib Anjum**

[![GitHub](https://img.shields.io/badge/GitHub-Saquib--Anjum-181717?style=flat&logo=github)](https://github.com/Saquib-Anjum)

---

<div align="center">

⭐ **If you found this useful, give it a star!** ⭐

</div>