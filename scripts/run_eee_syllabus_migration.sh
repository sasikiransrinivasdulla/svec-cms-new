#!/bin/bash

# Simple script to execute the EEE syllabus migration SQL
# This script will be used when database access is available

echo "🚀 Starting EEE Syllabus Migration..."
echo ""

# Check if MySQL client is available
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client not found. Please install MySQL client first."
    exit 1
fi

# Database connection details
DB_HOST="62.72.31.209"
DB_USER="svec_cms_user"
DB_PASS="V@savi@2001"
DB_NAME="svec_cms"

echo "📋 Database Details:"
echo "   Host: $DB_HOST"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Execute the SQL file
echo "📄 Executing SQL migration file..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < eee_syllabus_migration.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ EEE Syllabus migration completed successfully!"
    echo ""
    echo "📊 Verifying data..."
    
    # Verify the data
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
    SELECT 'Total EEE Syllabus Documents:' as info, COUNT(*) as count 
    FROM syllabus_documents 
    WHERE department = 'EEE';
    
    SELECT 'By Regulation and Type:' as info, regulation, type, COUNT(*) as count 
    FROM syllabus_documents 
    WHERE department = 'EEE' 
    GROUP BY regulation, type 
    ORDER BY regulation, type;
    "
    
    echo ""
    echo "🎉 Migration Summary:"
    echo "   ✅ Syllabus documents successfully migrated"
    echo "   ✅ API route updated to fetch syllabus data"
    echo "   ✅ Frontend component updated to display syllabus"
    echo "   ✅ TypeScript interfaces added for type safety"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Test the EEE department Syllabus section"
    echo "   2. Verify that documents are displaying correctly"
    echo "   3. Check download and view links functionality"
    
else
    echo ""
    echo "❌ Migration failed. Please check the error messages above."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Verify database connection details"
    echo "   2. Ensure the user has required permissions"
    echo "   3. Check if syllabus_documents table exists"
    exit 1
fi