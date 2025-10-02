import { Routes, Route, Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Agents from "./Agents"
import UploadLeads from "./UploadLeads"
import LeadDistribution from "./LeadDistribution"
import Overview from "./Overview"
import MyLeads from "./MyLeads"

const Dashboard = () => {
    const { user, logout, isAdmin, isAgent } = useAuth()
    const location = useLocation()

    const adminNavigation = [
        { name: "Overview", path: "/dashboard", icon: "📊" },
        { name: "Agents", path: "/dashboard/agents", icon: "👥" },
        { name: "Upload Leads", path: "/dashboard/upload", icon: "📤" },
        { name: "Lead Distribution", path: "/dashboard/leads", icon: "📋" },
    ]

    const agentNavigation = [{ name: "My Leads", path: "/dashboard", icon: "📋" }]

    const navigation = isAdmin() ? adminNavigation : agentNavigation

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === path
        }
        return location.pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Agent Management System</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {user?.role === "admin" ? "Admin" : "Agent"}
                            </span>
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    <aside className="w-64 flex-shrink-0">
                        <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive(item.path) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1">
                        <Routes>
                            {isAdmin() ? (
                                <>
                                    <Route path="/" element={<Overview />} />
                                    <Route path="/agents" element={<Agents />} />
                                    <Route path="/upload" element={<UploadLeads />} />
                                    <Route path="/leads" element={<LeadDistribution />} />
                                </>
                            ) : (
                                <>
                                    <Route path="/" element={<MyLeads />} />
                                </>
                            )}
                        </Routes>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
