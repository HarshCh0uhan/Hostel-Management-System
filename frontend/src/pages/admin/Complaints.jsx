import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState({ status: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [noteInput, setNoteInput] = useState({});

  const fetchComplaints = () => {
    const params = new URLSearchParams();
    if (filter.status) params.append("status", filter.status);
    if (filter.category) params.append("category", filter.category);
    api.get(`/complaints?${params}`)
      .then((res) => setComplaints(res.data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, [filter]);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/complaints/${id}/status`, { status, adminNote: noteInput[id] || undefined });
      fetchComplaints();
      setNoteInput((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setUpdating(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
    };
    return `text-xs font-medium px-2 py-0.5 rounded-full ${map[status]}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Complaints</h1>

      <div className="flex gap-3 mb-6">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          {["electricity", "water", "cleaning", "internet", "other"].map((c) => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : complaints.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No complaints found.</div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{c.title}</h3>
                    <span className={statusBadge(c.status)}>{c.status.replace("_", " ")}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{c.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    by {c.student?.username} · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{c.description}</p>

              {c.status !== "resolved" && (
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    value={noteInput[c._id] || ""}
                    onChange={(e) => setNoteInput({ ...noteInput, [c._id]: e.target.value })}
                    placeholder="Admin note (optional)"
                    className="flex-1 min-w-40 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {c.status === "pending" && (
                    <button onClick={() => handleUpdate(c._id, "in_progress")} disabled={updating === c._id}
                      className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-50">
                      Mark In Progress
                    </button>
                  )}
                  <button onClick={() => handleUpdate(c._id, "resolved")} disabled={updating === c._id}
                    className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 disabled:opacity-50">
                    Mark Resolved
                  </button>
                </div>
              )}
              {c.adminNote && (
                <p className="text-xs text-gray-500 mt-2">Note: {c.adminNote}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}