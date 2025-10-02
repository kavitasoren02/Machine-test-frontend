import { useState, useEffect } from "react"
import { _get } from "../utils/apiClient"

const Overview = () => {
    const [stats, setStats] = useState({
        totalAgents: 0,
        totalLeads: 0,
        distribution: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [agentsRes, leadsRes, statsRes] = await Promise.all([
                _get("/api/agents"),
                _get("/api/leads"),
                _get("/api/leads/stats"),
            ])

            setStats({
                totalAgents: agentsRes.data.count,
                totalLeads: leadsRes.data.count,
                distribution: statsRes.data.stats,
            })
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome to the Agent Management System</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Agents</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAgents}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Leads</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLeads}</p>
                        </div>
                        <div className="text-4xl">📋</div>
                    </div>
                </div>
            </div>

            {stats.distribution.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Distribution by Agent</h3>
                    <div className="space-y-4">
                        {stats.distribution.map((item) => (
                            <div key={item.agentId} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{item.agentName}</p>
                                    <p className="text-sm text-gray-600">{item.agentEmail}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">{item.leadsCount}</p>
                                    <p className="text-xs text-gray-600">leads</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {stats.totalAgents === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-blue-800 font-medium">Get started by adding agents to your system</p>
                    <p className="text-blue-600 text-sm mt-1">Navigate to the Agents page to create your first agent</p>
                </div>
            )}
        </div>
    )
}

export default Overview
