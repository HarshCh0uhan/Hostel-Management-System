import { useState, useEffect } from "react";
import api from "../../api/axios";

const CATEGORIES = ["electricity", "water", "cleaning", "internet", "other"];

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "electricity", title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = () => {
    api.get("/complaints/my")
      .then((res) => setComplaints(res.data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/complaints", form);
      setForm({ category: "electricity", title: "", description: "" });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete");
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Complaint"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Raise a Complaint</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe the issue..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No complaints yet.</div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{c.title}</h3>
                    <span className={statusBadge(c.status)}>{c.status.replace("_", " ")}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{c.category}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.description}</p>
                  {c.adminNote && (
                    <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-1.5 mt-2">
                      <span className="font-medium">Admin note:</span> {c.adminNote}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                {c.status === "pending" && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="ml-4 text-xs text-red-600 hover:text-red-700 hover:underline shrink-0"
                  >
                    Delete
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