# Hostel Management System — Backend

A RESTful API for managing hostel students, rooms, complaints, and leave requests.

**************Login As Admin-******************************

/api/auth/login
- Admin Login
email - admin@test.com
password - Admin@1234

-Student Login
email - student@test.com
password - Test@1234


/api/auth/register-admin (For registering admin)
(It will be requiring admin_secret_key make a .env file in backend)

***************************************************************

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (cookie-based)
- bcryptjs for password hashing

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `ADMIN_SECRET_KEY` | Key required to register an admin |
| `NODE_ENV` | `development` or `production` |

---

## API Reference

### Auth  `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register student |
| POST | `/register-admin` | ❌ | Register admin (requires adminSecretKey) |
| POST | `/login` | ❌ | Login |
| POST | `/logout` | ❌ | Logout |
| GET | `/me` | ✅ | Get logged-in user profile |

**Register body:**
```json
{ "username": "john", "email": "john@example.com", "password": "Pass@1234" }
```

**Register Admin body:**
```json
{ "username": "admin1", "email": "admin@hostel.com", "password": "Admin@1234", "adminSecretKey": "your_key" }
```

---

### Rooms  `/api/rooms`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/` | Any | List all rooms (filter: `?status=vacant&type=double`) |
| GET | `/:id` | Any | Get room details |
| POST | `/` | Admin | Create room |
| PUT | `/:id` | Admin | Update room |
| DELETE | `/:id` | Admin | Delete room |
| POST | `/:id/assign` | Admin | Assign student to room |
| POST | `/:id/remove` | Admin | Remove student from room |

**Create Room body:**
```json
{
  "roomNumber": "101",
  "floor": 1,
  "capacity": 2,
  "type": "double",
  "monthlyRent": 5000,
  "amenities": { "ac": false, "wifi": true, "attached_bathroom": false }
}
```

---

### Complaints  `/api/complaints`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/` | Student | Raise a complaint |
| GET | `/my` | Student | View own complaints (filter: `?status=pending`) |
| DELETE | `/:id` | Student | Delete pending complaint |
| GET | `/` | Admin | View all complaints (filter: `?status=&category=`) |
| PUT | `/:id/status` | Admin | Update status |

**Create Complaint body:**
```json
{
  "category": "electricity",
  "title": "Fan not working",
  "description": "The ceiling fan in room 101 stopped working."
}
```
Categories: `electricity`, `water`, `cleaning`, `internet`, `other`

**Update Status body:**
```json
{ "status": "resolved", "adminNote": "Electrician fixed the fan." }
```

---

### Leave Requests  `/api/leaves`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/` | Student | Apply for leave |
| GET | `/my` | Student | View own leaves |
| DELETE | `/:id` | Student | Cancel pending leave |
| GET | `/` | Admin | View all leave requests |
| PUT | `/:id/review` | Admin | Approve or reject |

**Apply Leave body:**
```json
{
  "fromDate": "2024-12-20",
  "toDate": "2024-12-25",
  "reason": "Family function",
  "destination": "Mumbai",
  "contactDuringLeave": "+91-9876543210"
}
```

---

### Admin  `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Stats: students, rooms, complaints, leaves |
| GET | `/students` | All students (search: `?search=john`) |
| GET | `/students/:id` | Student profile + their complaints & leaves |
| DELETE | `/students/:id` | Remove student |

---

## Role-Based Access

| Feature | Student | Admin |
|---|---|---|
| View own profile | ✅ | ✅ |
| View room details | ✅ | ✅ |
| Submit complaint | ✅ | ❌ |
| Apply for leave | ✅ | ❌ |
| Manage rooms | ❌ | ✅ |
| Update complaint status | ❌ | ✅ |
| Approve/reject leaves | ❌ | ✅ |
| Dashboard stats | ❌ | ✅ |

## Project Structure

```
backend/
├── src/
│   ├── app.js                  # Entry point
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── room.controller.js
│   │   ├── complaint.controller.js
│   │   ├── leave.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.js
│   │   ├── room.js
│   │   ├── complaint.js
│   │   └── leave.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── room.route.js
│   │   ├── complaint.route.js
│   │   ├── leave.route.js
│   │   └── admin.route.js
│   └── utils/
│       ├── jwt.js
│       └── validation.js
├── .env.example
└── package.json
```