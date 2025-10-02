# Agent Management System - MERN Stack - Frontend

A full-stack application for managing agents and distributing leads built with MongoDB, Express.js, React, and Node.js.

## Features

- **Admin Authentication**: Secure login system using JWT cookies
- **Agent Management**: Create, view, and delete agents with complete details
- **CSV Upload**: Upload CSV/Excel files with lead data
- **Automatic Distribution**: Leads are automatically distributed equally among agents
- **Lead Tracking**: View all leads and their assigned agents
- **Statistics Dashboard**: Real-time overview of agents and lead distribution

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios for API calls

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js
- MongoDB
- npm

## Installation & Setup

### Frontend Setup

```bash
git clone https://github.com/kavitasoren02/Machine-test-frontend.git
cd Machine-test-frontend
```

```bash
# Install dependencies
npm install

# Create .env file
cp .env
```

Edit the `.env` file with your configuration:

```env
VITE_API_BASE_URL=http://localhost:5000
```

This will create an admin user with the following credentials:
- **Email**: admin@example.com
- **Password**: admin123

**Important**: Change these credentials after your first login!

## Running the Application

### Start Frontend Development Server

```bash
# From frontend directory
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage Guide

### 1. Login

- Navigate to `http://localhost:5173`
- Use the default admin credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

### 2. Add Agents

- Click on "Agents" in the sidebar
- Click "Add Agent" button
- Fill in the agent details:
  - Name
  - Email
  - Mobile Number (with country code)
  - Password (minimum 6 characters)
- Click "Create Agent"

### 3. Upload Leads

- Click on "Upload Leads" in the sidebar
- Prepare a CSV or Excel file with the following columns:
  - **FirstName** (required)
  - **Phone** (required)
  - **Notes** (optional)
- Drag and drop the file or click "Browse Files"
- Click "Upload and Distribute"

The system will automatically:
- Validate the file format
- Parse the data
- Distribute leads equally among all agents
- Handle remaining leads by distributing them sequentially

### 4. View Lead Distribution

- Click on "Lead Distribution" in the sidebar
- View statistics for each agent
- Filter leads by agent
- See complete lead details with assigned agents

## CSV File Format

Your CSV file should follow this format:

```csv
FirstName,Phone,Notes
John,1234567890,Interested in product A
Jane,9876543210,Follow up next week
Mike,5555555555,
```

**Supported File Formats**: CSV, XLSX, XLS (Max 5MB)

## Project Structure

```
agent-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Agents.jsx
│   │   │   ├── MyLeads.jsx
│   │   │   ├── UploadLeads.jsx
│   │   │   └── LeadDistribution.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
```

## Features Breakdown

### Authentication System
- JWT-based authentication with HTTP-only cookies
- Secure password hashing with bcrypt
- Protected routes on both frontend and backend
- Automatic token refresh

### Agent Management
- CRUD operations for agents
- Email validation
- Password strength requirements
- Mobile number with country code support

### Lead Distribution Algorithm
- Equal distribution among all agents
- Handles non-divisible numbers by distributing remainder sequentially
- Example: 27 leads among 5 agents = 6, 6, 5, 5, 5

### File Upload
- Supports CSV, XLSX, and XLS formats
- File size validation (5MB limit)
- Drag and drop interface
- Real-time validation feedback

## Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- CORS configuration
- Input validation on both client and server
- Protected API routes
- SQL injection prevention with Mongoose

## Error Handling

The application includes comprehensive error handling:
- Form validation errors
- File upload errors
- Database connection errors
- Authentication errors
- API request errors

## Development

### Frontend Development

```bash
npm run dev  # Vite dev server with HMR
```

### Build for Production

```bash
# Frontend
npm run build
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check the connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

### CORS Errors
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`

### File Upload Fails
- Check file format (CSV, XLSX, XLS only)
- Verify file size (max 5MB)
- Ensure `uploads/` directory exists in backend
