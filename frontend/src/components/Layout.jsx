import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const studentLinks = [
  { to: "/", label: "🏠 Dashboard", end: true },
  { to: "/rooms", label: "🛏 Rooms" },
  { to: "/complaints", label: "📋 Complaints" },
  { to: "/leaves", label: "✈️ Leaves" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "📊 Dashboard", end: true },
  { to: "/admin/rooms", label: "🛏 Rooms" },
  { to: "/admin/students", label: "👥 Students" },
  { to: "/admin/complaints", label: "📋 Complaints" },
  { to: "/admin/leaves", label: "✈️ Leaves" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-sm flex flex-col shrink-0">
        <div className="p-5 border-b">
          <h1 className="text-lg font-bold text-blue-600">Hostel Manager</h1>
          <p className="text-sm font-medium text-gray-700 mt-2 truncate">{user?.username}</p>
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full capitalize">
            {user?.role === "admin" ? "Admin" : "Student"}
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 font-medium text-left"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}