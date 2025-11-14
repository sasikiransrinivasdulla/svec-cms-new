# RSAC Items - Quick Reference Guide

## 🚀 Quick Start

### 1. Seed the Database
```bash
cd f:\svec-cms\migrations
node seed-rsac-items.js
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. View on Browser
Navigate to: `http://localhost:3000/academics` → Click "Academic Calendars" tab

---

## 📊 What Gets Fetched

The system fetches from **both**:
- ✅ `academic_calendars` table
- ✅ `rsac_items` table

**Merged and displayed together** with:
- UG items (left column)
- PG items (right column)

---

## 🗄️ RSAC Items Table Structure

```
id              → INT (PK, Auto-increment)
date            → DATE (Release/effective date)
content         → TEXT (Title/description)
link            → VARCHAR(255) (Document URL)
degree          → ENUM('UG', 'PG')
type            → ENUM('syllabus', 'regulations', 'academic-calendar')
posted_date     → DATETIME (Auto timestamp)
deleted_at      → DATETIME NULL (Soft delete)
```

---

## 🔌 API Endpoints

### Fetch All RSAC Items
```bash
GET /api/academics/rsac
```

### Filter by Degree
```bash
GET /api/academics/rsac?degree=UG
GET /api/academics/rsac?degree=PG
```

### Filter by Type
```bash
GET /api/academics/rsac?type=academic-calendar
GET /api/academics/rsac?type=syllabus
GET /api/academics/rsac?type=regulations
```

### Combine Filters
```bash
GET /api/academics/rsac?degree=UG&type=syllabus
```

### Add New Item
```bash
POST /api/academics/rsac
Content-Type: application/json

{
  "date": "2024-09-01",
  "degree": "UG",
  "type": "academic-calendar",
  "content": "I B.Tech Academic Calendar",
  "link": "https://example.com/calendar.pdf"
}
```

---

## 📝 Enum Values

### degree
- `UG` - Undergraduate
- `PG` - Postgraduate

### type
- `academic-calendar` - Academic calendar
- `syllabus` - Course syllabus
- `regulations` - Academic regulations

---

## 🎯 SQL Commands

### View All UG Academic Calendars
```sql
SELECT * FROM rsac_items 
WHERE degree = 'UG' 
AND type = 'academic-calendar' 
AND deleted_at IS NULL 
ORDER BY date DESC;
```

### View All PG Syllabus
```sql
SELECT * FROM rsac_items 
WHERE degree = 'PG' 
AND type = 'syllabus' 
AND deleted_at IS NULL;
```

### Count by Type
```sql
SELECT type, COUNT(*) 
FROM rsac_items 
WHERE deleted_at IS NULL 
GROUP BY type;
```

### Add New Item
```sql
INSERT INTO rsac_items (date, degree, type, content, link) 
VALUES ('2024-09-01', 'UG', 'academic-calendar', 'Title', 'https://link.pdf');
```

### Update Item
```sql
UPDATE rsac_items 
SET content = 'New Title', date = '2024-09-15' 
WHERE id = 1;
```

### Soft Delete
```sql
UPDATE rsac_items 
SET deleted_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Restore (Undo Delete)
```sql
UPDATE rsac_items 
SET deleted_at = NULL 
WHERE id = 1;
```

---

## 📁 Files Created/Modified

| File | Type | Purpose |
|------|------|---------|
| `/src/pages/Academics.tsx` | Modified | Added RSAC item fetch logic |
| `/src/app/api/academics/rsac/route.ts` | Created | RSAC items API endpoint |
| `/migrations/seed-rsac-items.js` | Created | Seed script for sample data |

---

## 📦 Sample Data Seeded

### UG (5 items)
- 📅 Academic Calendar: B.Tech II Year
- 📅 Academic Calendar: III B.Tech
- 📅 Academic Calendar: IV B.Tech
- 📚 Syllabus: B.Tech V23
- 📋 Regulations: B.Tech V23

### PG (5 items)
- 📅 Academic Calendar: M.Tech 1st Year
- 📅 Academic Calendar: MBA
- 📚 Syllabus: M.Tech V21
- 📋 Regulations: M.Tech V21
- 📋 Regulations: MBA V21

---

## 🔄 Data Fetching Flow

```
Academics.tsx
    ↓
Frontend calls 2 APIs in parallel:
    ├─ /api/academics/calendars (academic_calendars table)
    └─ /api/academics/rsac?type=academic-calendar (rsac_items table)
    ↓
Combine results:
    ├─ RSAC items first
    └─ Academic calendar items second
    ↓
Filter by degree (UG/PG) and display
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "No items showing" | Run: `node seed-rsac-items.js` |
| API returns empty | Check: `SELECT COUNT(*) FROM rsac_items;` |
| Page loading forever | Check F12 console for errors |
| Wrong items displayed | Verify `degree` and `type` values in database |

---

## 💡 Frontend Integration

### Fetch RSAC Items Only
```javascript
const response = await fetch('/api/academics/rsac');
const data = await response.json();
console.log(data.ug);   // UG items
console.log(data.pg);   // PG items
```

### Fetch Specific Type
```javascript
const response = await fetch('/api/academics/rsac?type=syllabus');
const data = await response.json();
```

### Combine Data (as done in Academics.tsx)
```javascript
const rsacResponse = await fetch('/api/academics/rsac?type=academic-calendar');
const calendarResponse = await fetch('/api/academics/calendars');

const rsacData = await rsacResponse.json();
const calendarData = await calendarResponse.json();

// Combine (RSAC first, then calendars)
const ugCombined = [...rsacData.ug, ...calendarData.ug];
const pgCombined = [...rsacData.pg, ...calendarData.pg];
```

---

## 📊 Data Mapping

When displaying items, the frontend handles both types:

```javascript
const isRsacItem = 'content' in item;

if (isRsacItem) {
  // RSAC item
  title = item.content;
  url = item.link;
} else {
  // Academic calendar item
  title = item.title;
  url = item.document_url;
}
```

---

## 🔗 Related Documentation

- Full Docs: `/md/RSAC_ITEMS_ACADEMIC_CALENDARS.md`
- UG/PG Calendars: `/md/UG_PG_ACADEMIC_CALENDARS_IMPLEMENTATION.md`
- Original Calendars: `/md/ACADEMIC_CALENDARS_DOCUMENTATION.md`

---

**Version**: 1.0 | **Date**: November 11, 2025 | **Status**: ✅ Ready to Use

## Next Steps

1. ✅ Run seed script: `node seed-rsac-items.js`
2. ✅ Start dev server: `npm run dev`
3. ✅ Navigate to: `/academics`
4. ✅ Click "Academic Calendars" tab
5. ✅ See combined UG & PG items from both tables!
