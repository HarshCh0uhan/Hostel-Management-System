import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchStudents = () => {
    const params = search ? `?search=${search}` : "";
    api.get(`/admin/students${params}`)
      .then((res) => setStudents(res.data.students))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this student?")) return;
    try {
      await api.delete(`/admin/students/${id}`);
      setStudents((s) => s.filter((x) => x._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleViewStudent = async (id) => {
    try {
      const res = await api.get(`/admin/students/${id}`);
      setSelected(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Students</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); fetchStudents(); }}
            className="text-sm text-gray-500 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Clear
          </button>
        )}
      </form>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-500">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Room</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.username}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">{s.room?.roomNumber || "—"}</td>
                    <td className="px-4 py-3 flex gap-2 justify-end">
                      <button onClick={() => handleViewStudent(s._id)}
                        className="text-xs text-blue-600 hover:underline">View</button>
                      <button onClick={() => handleDelete(s._id)}
                        className="text-xs text-red-600 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No students found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Student detail panel */}
        {selected && (
          <div className="w-80 bg-white rounded-xl border border-gray-200 p-4 shrink-0 overflow-y-auto max-h-[70vh]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{selected.student.username}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-1">{selected.student.email}</p>
            <p className="text-sm text-gray-500 mb-4">Room: {selected.student.room?.roomNumber || "Not assigned"}</p>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Complaints</h4>
            {selected.complaints.length === 0 ? (
              <p className="text-xs text-gray-400 mb-4">None</p>
            ) : (
              <div className="space-y-1 mb-4">
                {selected.complaints.slice(0, 3).map((c) => (
                  <p key={c._id} className="text-xs text-gray-600">• {c.title} ({c.status})</p>
                ))}
              </div>
            )}

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Leaves</h4>
            {selected.leaves.length === 0 ? (
              <p className="text-xs text-gray-400">None</p>
            ) : (
              <div className="space-y-1">
                {selected.leaves.slice(0, 3).map((l) => (
                  <p key={l._id} className="text-xs text-gray-600">• {l.reason} ({l.status})</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}