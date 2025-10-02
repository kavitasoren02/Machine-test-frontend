import { useState } from "react"
import { _post } from "../utils/apiClient"

const UploadLeads = () => {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [dragActive, setDragActive] = useState(false)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        validateAndSetFile(selectedFile)
    }

    const validateAndSetFile = (selectedFile) => {
        setError("")
        setSuccess("")

        if (!selectedFile) {
            return
        }

        const allowedTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase()
        const allowedExtensions = ["csv", "xlsx", "xls"]

        if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
            setError("Invalid file type. Only CSV, XLSX, and XLS files are allowed")
            return
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB")
            return
        }

        setFile(selectedFile)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!file) {
            setError("Please select a file to upload")
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await _post("/api/leads/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.data.success) {
                setSuccess(response.data.message)
                setFile(null)
                const fileInput = document.getElementById("file-input")
                if (fileInput) {
                    fileInput.value = ""
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to upload file")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Leads</h2>
                <p className="text-gray-600 mt-1">Upload a CSV or Excel file to distribute leads among agents</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                            }`}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />

                        <div className="space-y-4">
                            <div className="text-6xl">📄</div>
                            <div>
                                <p className="text-lg font-medium text-gray-900">{file ? file.name : "Drag and drop your file here"}</p>
                                <p className="text-sm text-gray-600 mt-1">or</p>
                            </div>
                            <label
                                htmlFor="file-input"
                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition"
                            >
                                Browse Files
                            </label>
                            <p className="text-xs text-gray-500">Supported formats: CSV, XLSX, XLS (Max 5MB)</p>
                        </div>
                    </div>

                    {file && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📎</span>
                                    <div>
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null)
                                        const fileInput = document.getElementById("file-input")
                                        if (fileInput) {
                                            fileInput.value = ""
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                    disabled={uploading}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : "Upload and Distribute"}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">File Format Requirements</h3>
                <div className="space-y-3 text-sm text-gray-600">
                    <p>Your CSV or Excel file should contain the following columns:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>FirstName</strong> (required) - Text field for the lead's first name
                        </li>
                        <li>
                            <strong>Phone</strong> (required) - Number field for the lead's phone number
                        </li>
                        <li>
                            <strong>Notes</strong> (optional) - Text field for additional notes
                        </li>
                    </ul>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">Example CSV format:</p>
                        <code className="text-xs">
                            FirstName,Phone,Notes
                            <br />
                            John,1234567890,Interested in product A<br />
                            Jane,9876543210,Follow up next week
                        </code>
                    </div>
                    <p className="mt-4 text-blue-600">
                        Note: Leads will be automatically distributed equally among all available agents.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UploadLeads
