# Mondiant Scholar Tracker

A Flowcode API-powered scholarship applicant onboarding and engagement tracker, built for the **Mondiant Initiative** as part of the Flowcode Fellowship (Rwanda 2026) API Innovation Project.

## The Problem

Mondiant runs scholarships, a Leadership Academy, and vocational programs for refugee students across a multi-stage pipeline - info sessions, applications, admissions, onboarding. There's currently no easy way to see where interested people drop off along that journey, or how much engagement outreach efforts (flyers, info sessions) actually generate.

## What This Does

A QR-code-driven onboarding flow:

1. A Flowcode (QR code) is scanned by a prospective applicant.
2. It lands them on a page with the application checklist, key dates, and a short interest form.
3. Every scan and every form submission is logged.
4. A live dashboard shows real-time engagement data: total scans, total applicants, completion rate, and applicant interest by region.

This gives Mondiant staff visibility they don't currently have - real numbers on where their outreach pipeline leaks people, not just anecdote.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB/Mongoose (MVC structure)
- **Frontend:** Plain HTML/CSS/JS (no framework, by design - speed over sophistication for the build timeline)
- **External API:** Flowcode Developer API (QR code generation, analytics)
- **Database:** MongoDB Atlas

## Project Structure

mondiant-scholar-tracker/
├── server.js # entry point
├── src/
│ ├── config/db.js # MongoDB connection
│ ├── models/ # Applicant, ScanEvent schemas
│ ├── controllers/ # request handlers
│ ├── services/ # Flowcode API integration
│ ├── routes/ # URL to controller mapping
│ ├── middleware/ # error handling
│ └── public/ # applicant-facing landing page + live dashboard

## Setup

``````bash
git clone https://github.com/Tabitha2005/Mondiant-Scholar-Tracker.git
cd mondiant-scholar-tracker
cp .env.example .env
# fill in your real values in .env
npm install
npm start
``````

Visit ``http://localhost:3000`` for the applicant form, and ``http://localhost:3000/dashboard.html`` for the live engagement dashboard.

## Environment Variables

See ``.env.example`` for the full list. You'll need:
- A MongoDB Atlas connection string
- Flowcode Client ID, Client Secret, Org ID, and Workspace ID

## Status

Built for presentation as part of the Flowcode Fellowship API Innovation Project (Rwanda 2026 cohort). Current version tracks a single stage of the applicant journey; the natural next step is extending the same pattern across the full scholar pipeline (applicant to scholar to academy to alumni).

## Author

Aluel Tabitha Kuir - Flowcode Fellowship, Rwanda 2026 cohort
