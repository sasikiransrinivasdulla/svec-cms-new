# Academic Calendars - Quick Start Guide

## 📋 What's New?

A complete **Academic Calendars Module** with dynamic content management:
- ✅ Create academic calendars for different programs
- ✅ Manage important dates and events
- ✅ Mark events as important
- ✅ Track calendar status (draft/published/archived)
- ✅ Expandable event management interface

## 🚀 Quick Setup (2 minutes)

### Step 1: Create Database Tables
```bash
cd c:\Users\AtriDatta\Desktop\SVEC-CMS
node scripts/setup-academic-calendars-table.js
```

You should see:
```
✅ Academic calendars tables setup completed successfully!
🎉 Setup complete! You can now use the academic calendars module.
```

### Step 2: Test the Module
1. Open your browser and navigate to `/exam-section/academic-calendars`
2. Click **"Add New Calendar"**
3. Fill in the form:
   ```
   Title: B.Tech Academic Calendar 2024-2025
   Academic Year: 2024-2025
   Program Type: B.Tech
   Department: Computer Science
   Start Date: 2024-07-01
   End Date: 2025-06-30
   Status: Published
   ```
4. Click **"Save Calendar"**
5. Click on the new calendar to expand it
6. Add an event:
   ```
   Event Name: Semester Begins
   Event Date: 2024-07-15
   Event Type: Semester
   Mark as Important: ✓
   ```
7. Click **"Add Event"**

## 📊 Database Schema

### Tables Created

**academic_calendars** - Main calendar information
- Tracks title, dates, program type, department, status
- Supports soft deletes (preserves data)
- Has efficient indexes for fast queries

**academic_calendar_events** - Events within calendars
- Tracks event names, dates, types, importance
- Links to parent calendar
- 6 event types: holiday, exam, semester, registration, orientation, other

## 🎨 UI Features

### Calendar Display
```
┌─────────────────────────────────────────────────┐
│ B.Tech Academic Calendar 2024-2025             │
│ Jul 1, 2024 - Jun 30, 2025 • B.Tech            │
│ Computer Science • Published • 15 events       │
└─────────────────────────────────────────────────┘
```

### Event Types (Color-Coded)
- 🔴 **Holiday** - University holidays
- 🟠 **Exam** - Examination periods
- 🟣 **Semester** - Semester start/end
- 🔵 **Registration** - Registration windows
- 🟦 **Orientation** - Orientation programs
- ⚫ **Other** - Miscellaneous

### Status Badges
- ⚪ **Draft** - Work in progress
- 🟢 **Published** - Active and visible
- 🔵 **Archived** - Past calendars

## 📝 API Endpoints

All endpoints use JSON and are located at `/api/exam-section/academic-calendars`:

```
GET  /                          - Get all calendars
POST /                          - Create calendar
PUT  /                          - Update calendar
DEL  /                          - Delete calendar

GET  /[calendarId]/events       - Get calendar events
POST /[calendarId]/events       - Add event
PUT  /[calendarId]/events       - Update event
DEL  /[calendarId]/events       - Delete event
```

## 🔄 CRUD Operations

### Create Calendar
1. Click "Add New Calendar"
2. Fill all required fields (*)
3. Click "Save Calendar"

### Read Calendars
- Page automatically loads all calendars on load
- Click any calendar to expand and see events

### Update Calendar
1. Click pencil icon on calendar
2. Modify any field
3. Click "Update Calendar"

### Delete Calendar
1. Click trash icon on calendar
2. Confirm deletion
3. Calendar is soft-deleted (data preserved in database)

### Manage Events
1. Expand calendar (click on it)
2. Add events using the "Add Event" form
3. Edit/delete events using buttons

## ✅ Required Fields

### Calendar Form
- **Title** - Calendar name/title
- **Academic Year** - Format: YYYY-YYYY (e.g., 2024-2025)
- **Program Type** - B.Tech, M.Tech, M.B.A, M.C.A, or Diploma
- **Start Date** - Calendar start date
- **End Date** - Calendar end date (must be after start date)

### Event Form
- **Event Name** - Name of the event
- **Event Date** - Date when event occurs

## 🔍 Validation

The system validates:
- ✅ All required fields are filled
- ✅ Start date is before end date
- ✅ Event dates are valid
- ✅ Event names are not empty

## 📂 Files Created/Modified

### New Files
- `/sql/create_academic_calendars_table.sql` - Database schema
- `/scripts/setup-academic-calendars-table.js` - Setup script
- `/src/app/exam-section/academic-calendars/page.tsx` - Frontend page
- `/src/app/api/exam-section/academic-calendars/route.ts` - Calendar API
- `/src/app/api/exam-section/academic-calendars/[calendarId]/events/route.ts` - Events API
- `/md/ACADEMIC_CALENDARS_DOCUMENTATION.md` - Full documentation

### Modified Files
- `/src/app/exam-section/academic-calendars/route.ts` - Updated to use database

## 🎯 Common Tasks

### Add Holiday Period
1. Create calendar for academic year
2. Expand calendar
3. Add events with type "Holiday"
4. Mark important holidays as important

### Create Exam Schedule
1. Create calendar
2. Add multiple events with type "Exam"
3. Set start and end dates for exam period
4. Mark important exams as important

### Publish Calendar to Department
1. Create calendar
2. Set department field
3. Add all relevant events
4. Change status to "Published"

## 🐛 Troubleshooting

### No calendars showing?
- Check browser console (F12) for errors
- Verify database tables exist: `node scripts/setup-academic-calendars-table.js`
- Check network tab to see API responses

### Can't add events?
- Make sure calendar is saved first
- Click expand button to open event form
- Check all required fields are filled

### Events not appearing?
- Refresh the page
- Expand the calendar again
- Check browser console for errors

## 📞 Support

For issues or questions:
1. Check the full documentation: `/md/ACADEMIC_CALENDARS_DOCUMENTATION.md`
2. Check browser console (F12) for error messages
3. Check database table structure: `DESCRIBE academic_calendars;`

## 🎉 You're All Set!

The Academic Calendars module is now ready to use. Navigate to `/exam-section/academic-calendars` to start managing your academic calendars!
