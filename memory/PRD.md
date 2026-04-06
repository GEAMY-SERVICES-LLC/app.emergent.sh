# Geamy Services LLC - Website PRD

## Original Problem Statement
Create a modern, dark-themed professional website for Geamy Services LLC, an IT services company based in Miami, Florida.

## Architecture
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Email**: Microsoft Graph API (prepared, awaiting credentials)
- **Auth**: JWT-based admin authentication

## User Personas
1. **Business Owner** - Looking for IT services, needs to quickly understand offerings and contact
2. **Admin** - Needs to view contact submissions and analytics

## Core Requirements (Static)
- Dark theme with #040810 background, #00d4ff cyan accent, #00ff88 green
- Unbounded font for headings, DM Mono for body
- Terminal-style UI elements
- Mobile responsive
- 8 IT service categories

## What's Been Implemented (April 6, 2026)
### Frontend
- [x] Sticky navigation with smooth scroll
- [x] Hero section with animated terminal widget
- [x] Stats bar (12+ years, 50+ projects, 30-day warranty)
- [x] 8 Service cards with tech tags
- [x] About section with tech stack marquee
- [x] Certifications display
- [x] Terms & Conditions (two columns)
- [x] Contact form with service dropdown
- [x] Footer with navigation
- [x] Admin login page
- [x] Admin dashboard with analytics

### Backend
- [x] Contact form submission API
- [x] Analytics tracking (page views)
- [x] Admin authentication (JWT)
- [x] Contact management (CRUD)
- [x] Analytics summary endpoint
- [x] Microsoft Graph email integration (code ready, awaiting credentials)

### Database (MongoDB)
- contacts collection
- analytics collection
- admins collection

## Prioritized Backlog
### P0 - Critical (Completed)
- [x] All core website sections
- [x] Contact form functionality
- [x] Admin panel

### P1 - Important (Pending User Input)
- [ ] Microsoft Graph email credentials configuration
  - AZURE_CLIENT_ID
  - AZURE_CLIENT_SECRET
  - AZURE_TENANT_ID

### P2 - Nice to Have
- [ ] Email notification when contact is submitted
- [ ] Admin password change functionality
- [ ] Contact export to CSV
- [ ] Dark/Light theme toggle (not requested)

## Next Tasks
1. User provides Microsoft Graph credentials for email sending
2. Configure credentials in backend/.env
3. Test email functionality

## Test Credentials
- Admin: admin@geamyservices.com / GeamyAdmin2024!
