import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const cards = [
    { label: "Total Students", value: stats.totalStudents, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Rooms", value: stats.totalRooms, color: "text-gray-700", bg: "bg-gray-50" },
    { label: "Occupied Rooms", value: stats.occupiedRooms, color: "text-red-600", bg: "bg-red-50" },
    { label: "Vacant Rooms", value: stats.vacantRooms, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Complaints", value: stats.pendingComplaints, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Pending Leaves", value: stats.pendingLeaves, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-5 border border-gray-100`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}