import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function StudentRooms() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState({ status: "", type: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.status) params.append("status", filter.status);
    if (filter.type) params.append("type", filter.type);

    api.get(`/rooms?${params}`)
      .then((res) => setRooms(res.data.rooms))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const statusColor = {
    vacant: "bg-green-100 text-green-700",
    occupied: "bg-red-100 text-red-700",
    maintenance: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rooms</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg">Room {room.roomNumber}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor[room.status]}`}>
                  {room.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Floor: {room.floor}</p>
                <p>Type: <span className="capitalize">{room.type}</span></p>
                <p>Capacity: {room.occupants?.length ?? 0} / {room.capacity}</p>
                <p>Rent: ₹{room.monthlyRent}/month</p>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {room.amenities?.ac && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">AC</span>}
                {room.amenities?.wifi && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">WiFi</span>}
                {room.amenities?.attached_bathroom && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Attached Bath</span>}
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <p className="text-gray-500 col-span-3">No rooms found.</p>
          )}
        </div>
      )}
    </div>
  );
}
