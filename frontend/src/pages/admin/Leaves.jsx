import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [noteInput, setNoteInput] = useState({});

  const fetchLeaves = () => {
    const params = filter ? `?status=${filter}` : "";
    api.get(`/leaves${params}`)
      .then((res) => setLeaves(res.data.leaves))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, [filter]);

  const handleReview = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/leaves/${id}/review`, { status, adminNote: noteInput[id] || undefined });
      fetchLeaves();
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
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return `text-xs font-medium px-2 py-0.5 rounded-full ${map[status]}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Leave Requests</h1>

      <div className="flex gap-3 mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : leaves.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No leave requests found.</div>
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <div key={l._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{l.reason}</h3>
                    <span className={statusBadge(l.status)}>{l.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    by {l.student?.username} · {new Date(l.fromDate).toLocaleDateString()} → {new Date(l.toDate).toLocaleDateString()}
                    {l.destination && ` · to ${l.destination}`}
                  </p>
                  {l.contactDuringLeave && (
                    <p className="text-xs text-gray-500">Contact: {l.contactDuringLeave}</p>
                  )}
                </div>
              </div>

              {l.status === "pending" && (
                <div className="flex gap-2 items-center flex-wrap mt-3">
                  <input
                    value={noteInput[l._id] || ""}
                    onChange={(e) => setNoteInput({ ...noteInput, [l._id]: e.target.value })}
                    placeholder="Admin note (optional)"
                    className="flex-1 min-w-40 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={() => handleReview(l._id, "approved")} disabled={updating === l._id}
                    className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 disabled:opacity-50">
                    Approve
                  </button>
                  <button onClick={() => handleReview(l._id, "rejected")} disabled={updating === l._id}
                    className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-50">
                    Reject
                  </button>
                </div>
              )}
              {l.adminNote && (
                <p className="text-xs text-gray-500 mt-2">Note: {l.adminNote}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}