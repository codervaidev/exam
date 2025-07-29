# Sequential Exam System Implementation

## Overview
This implementation adds a sequential exam system where users must complete exams in a specific order within a campaign. Each exam becomes available only after completing the previous exam(s).

## Database Changes

### 1. Added `sequence_order` column to `free_exam_exams` table
```sql
ALTER TABLE "free_exam_exams" ADD COLUMN "sequence_order" INT NOT NULL DEFAULT 1;
```

### 2. Migration script for existing exams
```sql
-- Migration: Add sequence_order to existing exams
UPDATE free_exam_exams 
SET sequence_order = (
    SELECT row_number() OVER (PARTITION BY campaign_id ORDER BY start_time ASC)
    FROM free_exam_exams e2 
    WHERE e2.campaign_id = free_exam_exams.campaign_id
)
WHERE sequence_order IS NULL OR sequence_order = 1;
```

## API Changes

### 1. Updated Exam Schema (`schema/exam.schema.ts`)
- Added `sequenceOrder` field to `ExamSchema`

### 2. Updated Exam Creation API (`server/api/admin/exam/index.post.ts`)
- Automatically assigns sequence order based on existing exams in campaign
- Includes sequence_order in database insert

### 3. Updated Exam Update API (`server/api/admin/exam/[id]/index.put.ts`)
- Includes sequence_order in database update

### 4. Enhanced Main Exams API (`server/api/exams/index.get.ts`)
- Added sequential logic to determine locked/unlocked status
- Returns `isLocked` and `lockReason` for each exam
- Orders exams by sequence_order within campaigns

### 5. Enhanced Question Access API (`server/api/question/[exam]/index.get.ts`)
- Prevents access to locked exams
- Uses utility function for sequential validation

### 6. New Utility Functions (`server/utils/exam.ts`)
- `checkExamAccess()`: Validates if user can access an exam
- `getNextAvailableExam()`: Finds the next available exam for a user

### 7. New Next Exam API (`server/api/exams/next.get.ts`)
- Returns the next available exam for a user in a campaign

## Frontend Changes

### 1. Updated ExamCard Component (`components/Exam/Card.vue`)
- Shows locked/unlocked status with visual indicators
- Displays sequence order number
- Prevents access to locked exams
- Shows lock reason to users

### 2. Updated Admin Exam Modal (`components/Exam/Modal.vue`)
- Added sequence order input field
- Includes sequence order in form submission

### 3. Updated Admin Exam Creation Page (`pages/admin/exams/create.vue`)
- Added sequence order input field
- Includes sequence order in form submission

### 4. Updated Admin Exam View (`components/Exam/View.vue`)
- Displays sequence order in admin interface

## Key Features

### 1. Sequential Access Control
- Users must complete exams in order (1, 2, 3, etc.)
- Exams are locked until previous exams are completed
- Clear visual indicators show locked status

### 2. Campaign-Based Logic
- Sequential logic only applies within campaigns
- Non-campaign exams remain unaffected
- Each campaign maintains its own sequence

### 3. Admin Management
- Admins can set sequence order when creating exams
- Automatic sequence assignment for new exams
- Visual display of sequence order in admin interface

### 4. User Experience
- Clear lock indicators with reasons
- Prevents accidental access to locked exams
- Maintains existing functionality for unlocked exams

## Testing Instructions

### 1. Database Setup
```bash
# Run the migration to add sequence_order column
# Execute the SQL in migration/tables.sql
```

### 2. Create Test Campaign
1. Go to admin panel
2. Create a new campaign
3. Create multiple exams with different sequence orders (1, 2, 3, etc.)

### 3. Test Sequential Access
1. Login as a regular user
2. Navigate to the campaign
3. Verify that only the first exam is accessible
4. Complete the first exam
5. Verify that the second exam becomes accessible
6. Repeat for subsequent exams

### 4. Test Admin Features
1. Create new exams with sequence orders
2. Verify automatic sequence assignment
3. Check sequence order display in admin interface

## Security Considerations

1. **Server-side validation**: All sequential logic is enforced on the server
2. **API protection**: Question access API prevents access to locked exams
3. **Database constraints**: Sequence order is stored and validated at database level

## Future Enhancements

1. **Bulk sequence reordering**: Allow admins to reorder multiple exams at once
2. **Conditional unlocking**: Allow exams to unlock based on score thresholds
3. **Progress tracking**: Show user progress through campaign sequence
4. **Skip options**: Allow admins to grant skip permissions for certain users 