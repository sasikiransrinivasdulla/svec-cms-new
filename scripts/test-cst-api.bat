@echo off
echo 🚀 Testing CST Admin Dashboard API Routes
echo =========================================

echo 📝 Testing login...
curl -s -X POST "http://localhost:3000/api/auth/login" -H "Content-Type: application/json" -d "{\"identifier\":\"cst_admin\",\"password\":\"CSTAdmin@2024\"}" > login_response.json

echo Login Response:
type login_response.json
echo.

echo 📊 Testing CST Faculty Module without auth...
curl -s -X GET "http://localhost:3000/api/admin/departments/cst/faculty"

echo.
echo.
echo 🏗️ Testing Table Structure Endpoint without auth...
curl -s -X GET "http://localhost:3000/api/admin/departments/cst/faculty/structure"

echo.
echo.
echo ✅ API testing complete!
echo If you see JSON responses above, the API routes are working correctly.
echo If you see HTML or error messages, there are still issues to resolve.

del login_response.json 2>nul
pause