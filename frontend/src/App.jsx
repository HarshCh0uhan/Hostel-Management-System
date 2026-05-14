import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";
import StudentDashboard from "./pages/student/Dashboard";
import StudentRooms from "./pages/student/Rooms";
import StudentComplaints from "./pages/student/Complaints";
import StudentLeaves from "./pages/student/Leaves";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/Rooms";
import AdminStudents from "./pages/admin/Students";
import AdminComplaints from "./pages/admin/Complaints";
import AdminLeaves from "./pages/admin/Leaves";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/register-admin" element={!user ? <RegisterAdmin /> : <Navigate to="/" replace />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Root redirect based on role */}
          <Route
            path="/"
            element={
              user?.role === "admin"
                ? <Navigate to="/admin/dashboard" replace />
                : <StudentDashboard />
            }
          />

          {/* Student routes */}
          <Route path="/rooms" element={<StudentRooms />} />
          <Route path="/complaints" element={<StudentComplaints />} />
          <Route path="/leaves" element={<StudentLeaves />} />

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/leaves" element={<AdminLeaves />} />
          </Route>
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}