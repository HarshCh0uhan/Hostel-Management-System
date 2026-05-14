import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    roomNumber: "", floor: "", capacity: "2", type: "double", monthlyRent: "",
    amenities: { ac: false, wifi: true, attached_bathroom: false },
  });
  const [assignModal, setAssignModal] = useState(null); // roomId
  const [assignStudentId, setAssignStudentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRooms = () => {
    api.get("/rooms")
      .then((res) => setRooms(res.data.rooms))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
    api.get("/admin/students").then((res) => setStudents(res.data.students));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/rooms", { ...form, floor: Number(form.floor), capacity: Number(form.capacity), monthlyRent: Number(form.monthlyRent) });
      setShowForm(false);
      setForm({ roomNumber: "", floor: "", capacity: "2", type: "double", monthlyRent: "", amenities: { ac: false, wifi: true, attached_bathroom: false } });
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete");
    }
  };

  const handleAssign = async () => {
    try {
      await api.post(`/rooms/${assignModal}/assign`, { studentId: assignStudentId });
      setAssignModal(null);
      setAssignStudentId("");
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleRemove = async (roomId, studentId) => {
    if (!confirm("Remove student from room?")) return;
    try {
      await api.post(`/rooms/${roomId}/remove`, { studentId });
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const statusColor = { vacant: "bg-green-100 text-green-700", occupied: "bg-red-100 text-red-700", maintenance: "bg-yellow-100 text-yellow-700" };
  const unassignedStudents = students.filter((s) => !s.room);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {showForm ? "Cancel" : "+ Add Room"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">New Room</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={handleCreate} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: "roomNumber", label: "Room Number", placeholder: "101" },
              { key: "floor", label: "Floor", placeholder: "1", type: "number" },
              { key: "monthlyRent", label: "Monthly Rent (₹)", placeholder: "5000", type: "number" },
            ].map(({ key, label, placeholder, type = "text" }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <select value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="single">Single</option><option value="double">Double</option><option value="triple">Triple</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="flex gap-4">
                {[["ac", "AC"], ["wifi", "WiFi"], ["attached_bathroom", "Attached Bath"]].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.amenities[key]}
                      onChange={(e) => setForm({ ...form, amenities: { ...form.amenities, [key]: e.target.checked } })}
                      className="rounded" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <button type="submit" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
                Create Room
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assign modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Assign Student</h3>
            <select value={assignStudentId} onChange={(e) => setAssignStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select student...</option>
              {unassignedStudents.map((s) => (
                <option key={s._id} value={s._id}>{s.username} ({s.email})</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAssign} disabled={!assignStudentId}
                className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Assign
              </button>
              <button onClick={() => { setAssignModal(null); setAssignStudentId(""); }}
                className="flex-1 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room cards */}
      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg">Room {room.roomNumber}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor[room.status]}`}>{room.status}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>Floor {room.floor} · <span className="capitalize">{room.type}</span></p>
                <p>{room.occupants.length}/{room.capacity} occupants · ₹{room.monthlyRent}/mo</p>
              </div>

              {/* Occupants */}
              {room.occupants.length > 0 && (
                <div className="mb-3">
                  {room.occupants.map((o) => (
                    <div key={o._id} className="flex items-center justify-between text-xs py-1">
                      <span className="text-gray-700">{o.username}</span>
                      <button onClick={() => handleRemove(room._id, o._id)}
                        className="text-red-500 hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                {room.occupants.length < room.capacity && room.status !== "maintenance" && (
                  <button onClick={() => setAssignModal(room._id)}
                    className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-100">
                    + Assign
                  </button>
                )}
                <button onClick={() => handleDelete(room._id)}
                  className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}