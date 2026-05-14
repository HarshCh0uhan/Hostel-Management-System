import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function StudentLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fromDate: "", toDate: "", reason: "", destination: "", contactDuringLeave: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeaves = () => {
    api.get("/leaves/my")
      .then((res) => setLeaves(res.data.leaves))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/leaves", form);
      setForm({ fromDate: "", toDate: "", reason: "", destination: "", contactDuringLeave: "" });
      setShowForm(false);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this leave request?")) return;
    try {
      await api.delete(`/leaves/${id}`);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel");
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Leaves</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Apply for Leave"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Apply for Leave</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" required value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" required value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Family function, medical, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="Mumbai"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact During Leave</label>
              <input value={form.contactDuringLeave} onChange={(e) => setForm({ ...form, contactDuringLeave: e.target.value })}
                placeholder="+91-9876543210"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="text-gray-500">Loading...</div> : leaves.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No leave requests yet.</div>
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <div key={l._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{l.reason}</h3>
                    <span className={statusBadge(l.status)}>{l.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(l.fromDate).toLocaleDateString()} → {new Date(l.toDate).toLocaleDateString()}
                    {l.destination && ` · ${l.destination}`}
                  </p>
                  {l.adminNote && (
                    <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-1.5 mt-2">
                      <span className="font-medium">Admin note:</span> {l.adminNote}
                    </p>
                  )}
                </div>
                {l.status === "pending" && (
                  <button onClick={() => handleCancel(l._id)}
                    className="ml-4 text-xs text-red-600 hover:underline shrink-0">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}