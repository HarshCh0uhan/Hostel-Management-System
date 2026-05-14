import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [roomInfo, setRoomInfo] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/auth/me"),
      api.get("/complaints/my"),
      api.get("/leaves/my"),
    ])
      .then(([meRes, compRes, leaveRes]) => {
        setRoomInfo(meRes.data.user.room);
        setComplaints(compRes.data.complaints.slice(0, 3));
        setLeaves(leaveRes.data.leaves.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return `text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`;
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Hello, {user?.username}! 👋
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">My Room</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {roomInfo ? `#${roomInfo.roomNumber}` : "—"}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {roomInfo ? `Floor ${roomInfo.floor} · ${roomInfo.type}` : "Not assigned"}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Complaints</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{complaints.length}</p>
          <Link to="/complaints" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Leave Requests</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{leaves.length}</p>
          <Link to="/leaves" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Complaints</h2>
            <Link to="/complaints" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {complaints.length === 0 ? (
            <p className="text-sm text-gray-400">No complaints yet.</p>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c._id} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{c.category}</p>
                  </div>
                  <span className={statusBadge(c.status)}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leaves */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Leave Requests</h2>
            <Link to="/leaves" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {leaves.length === 0 ? (
            <p className="text-sm text-gray-400">No leave requests yet.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((l) => (
                <div key={l._id} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{l.reason}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(l.fromDate).toLocaleDateString()} – {new Date(l.toDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={statusBadge(l.status)}>{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}