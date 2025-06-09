# CityFix Hub Backend

Node.js backend for CityFix Hub, handling citizen issue reports, photo uploads, and integration with the React frontend.

## Features

- Express API server (CORS, JSON parsing)
- MongoDB integration using mongoose
- Report model: type, description, photo URL, location, status, createdAt
- REST API: create report, list all, update status, placeholder for Cloudinary photo uploads
- Environment variable support via dotenv
- Project structure for easy extension

## Endpoints

- `POST /api/reports` — Submit a new issue report
- `GET /api/reports` — Fetch all issue reports
- `PATCH /api/reports/:id/status` — Update the status of a particular report
- `POST /api/reports/upload` — Placeholder for photo upload (Cloudinary integration to be implemented)

## Setup

1. Copy `.env.example` to `.env` and set MongoDB URI and Cloudinary keys (if used).
2. Run `npm install` in the `backend` directory.
3. Start server: `node server.js` (or use nodemon for development)
4. The API server will run on the port specified in the `.env` (default 5000).

## Folder Structure

- `server.js` — Main Express app setup and entry point
- `/models/Report.js` — Mongoose schema/model for reports
- `/routes/reports.js` — API endpoints for report CRUD and uploads

## To Implement

- Actual Cloudinary integration for photo uploads (handle `POST /api/reports/upload`)
- Robust input validation and error handling
- Authentication & admin support (if required for status updates)

## Example .env

See `.env.example` for required variables.
