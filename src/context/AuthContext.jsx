import { createContext, useState, useContext, useEffect } from "react"
import { _get, _post } from "../utils/apiClient"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await _get("/api/auth/me")
            if (response.data.success) {
                setUser(response.data.user)
            }
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await _post("/api/auth/login", { email, password })
            if (response.data.success) {
                setUser(response.data.user)
                return { success: true }
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            }
        }
    }

    const logout = async () => {
        try {
            await _post("/api/auth/logout")
            setUser(null)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const isAdmin = () => user?.role === "admin"
    const isAgent = () => user?.role === "agent"

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth,
        isAdmin,
        isAgent,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}