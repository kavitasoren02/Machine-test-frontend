import { useState, useEffect } from "react"
import { _get } from "../utils/apiClient"

const LeadDistribution = () => {
    const [leads, setLeads] = useState([])
    const [agents, setAgents] = useState([])
    const [selectedAgent, setSelectedAgent] = useState("all")
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalLeads, setTotalLeads] = useState(0)
    const limit = 10

    useEffect(() => {
        fetchData()
    }, [currentPage, selectedAgent])

    const fetchData = async () => {
        try {
            setLoading(true)
            const leadsUrl =
                selectedAgent === "all"
                    ? `/api/leads?page=${currentPage}&limit=${limit}`
                    : `/api/leads/agent/${selectedAgent}?page=${currentPage}&limit=${limit}`

            const [leadsRes, agentsRes, statsRes] = await Promise.all([
                _get(leadsUrl),
                _get("/api/agents"),
                _get("/api/leads/stats"),
            ])

            setLeads(leadsRes.data.leads)
            setTotalPages(leadsRes.data.totalPages)
            setTotalLeads(leadsRes.data.totalLeads)
            setAgents(agentsRes.data.agents)
            setStats(statsRes.data.stats)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAgentChange = (agentId) => {
        setSelectedAgent(agentId)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    if (loading && currentPage === 1) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Lead Distribution</h2>
                <p className="text-gray-600 mt-1">View and manage distributed leads</p>
            </div>

            {stats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.agentId} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.agentName}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.agentEmail}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">{stat.leadsCount}</p>
                                    <p className="text-xs text-gray-600">leads</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center gap-4">
                    <label htmlFor="agent-filter" className="text-sm font-medium text-gray-700">
                        Filter by Agent:
                    </label>
                    <select
                        id="agent-filter"
                        value={selectedAgent}
                        onChange={(e) => handleAgentChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="all">All Agents</option>
                        {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600">
                        Showing {leads.length} of {totalLeads} leads
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">
                            {totalLeads === 0
                                ? "No leads found. Upload a CSV file to get started."
                                : "No leads found for the selected agent."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            First Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{lead.firstName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{lead.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">{lead.notes || "-"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{lead.assignedTo.name}</div>
                                                <div className="text-xs text-gray-500">{lead.assignedTo.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing page {currentPage} of {totalPages} ({totalLeads} total leads)
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || loading}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || loading}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default LeadDistribution
