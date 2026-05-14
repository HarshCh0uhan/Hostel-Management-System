# Hostel Management System — Frontend

Frontend application for the Hostel Management System built using React, Vite, Tailwind CSS, and React Router.  
This frontend connects with the backend REST API to manage authentication, rooms, complaints, leave requests, and admin operations.

---

# Features

## Student Features
- Student registration and login
- View available rooms
- Raise complaints
- Apply for leave
- Track complaint and leave status
- View personal dashboard

## Admin Features
- Admin login
- Dashboard statistics
- Manage rooms
- View and manage students
- Manage complaints
- Approve or reject leave requests

---

# Tech Stack

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

---

# Backend Requirement

The backend server must be running before starting the frontend.

Backend repository should support:
- JWT Authentication
- Cookie-based authentication
- CORS enabled with credentials

---

# Backend CORS Setup

Install CORS in backend:

```bash
npm install cors
```

Add CORS middleware in backend `app.js` before routes:

```js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
```

---

# Project Setup

## 1. Create Frontend

```bash
npm create vite@latest frontend -- --template react
```

## 2. Move into frontend directory

```bash
cd frontend
```

## 3. Install Dependencies

```bash
npm install
```

Install required packages:

```bash
npm install react-router-dom axios
```

Install Tailwind CSS:

```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

Initialize Tailwind:

```bash
npx tailwindcss init -p
```

---

# Tailwind Configuration

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

# Global Styles

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

---

# Frontend Structure

```text
frontend/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── Complaints.jsx
│   │   │   └── Leaves.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Rooms.jsx
│   │       ├── Students.jsx
│   │       ├── Complaints.jsx
│   │       └── Leaves.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

# Authentication

Authentication is handled using:
- JWT tokens
- HTTP-only cookies
- Context API for global auth state

Protected routes are used for:
- Logged-in users
- Admin-only pages

---

# API Configuration

Axios is configured with:
- Backend base URL
- `withCredentials: true`

Example backend URL:

```text
http://localhost:3000/api
```

---

# Available Pages

## Public Pages
- Login
- Register

## Student Pages
- Dashboard
- Rooms
- Complaints
- Leaves

## Admin Pages
- Dashboard
- Room Management
- Student Management
- Complaint Management
- Leave Management

---

# Routing

Frontend uses React Router DOM for:
- Protected routes
- Nested layouts
- Role-based routing
- Automatic redirects

---

# State Management

Global authentication state is managed using:
- React Context API
- React hooks

---

# UI Design

The UI is built with:
- Tailwind CSS utility classes
- Responsive layouts
- Sidebar navigation
- Dashboard cards
- Form validation states

---

# Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# Installed Packages

| Package | Purpose |
|---|---|
| react-router-dom | Client-side routing |
| axios | API requests |
| tailwindcss | Styling |
| postcss | Tailwind dependency |
| autoprefixer | CSS vendor prefixes |

---

# Environment Notes

Ensure:
- Backend is running
- MongoDB is connected
- CORS is enabled
- Cookies are allowed in browser

---

# Recommended Improvements

Future enhancements:
- Dark mode
- Notifications
- Real-time complaint updates
- File uploads
- Attendance system
- Payment integration
- Room allocation automation

---

# Author

Hostel Management System Project  
Built using MERN Stack
