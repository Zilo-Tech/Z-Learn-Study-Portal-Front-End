# Z-Learn Study Portal - API Endpoints Specification

## Overview
This document specifies all the API endpoints required for the new features in the Z-Learn Study Portal frontend. Each endpoint includes its purpose and required payload structure.

---

## 🎓 TUTOR API ENDPOINTS

### 1. Tutor Profile Management

#### `GET /tutors/profile/`
**Purpose**: Retrieve the current tutor's profile information
**Response**: Tutor profile data including subjects, hourly rate, bio, experience

#### `POST /tutors/profile/`
**Purpose**: Create a new tutor profile
**Payload**:
```json
{
  "subjects": ["python", "algorithms"],
  "hourly_rate": 25.0,
  "availability": {"mon": ["18:00-20:00"], "sat": ["10:00-12:00"]},
  "bio": "Experienced tutor",
  "years_experience": 5,
  "education": "PhD Computer Science",
  "certifications": ["Teaching Certificate", "Python Expert"],
  "languages": ["English", "French"]
}
```

#### `PATCH /tutors/profile/`
**Purpose**: Update existing tutor profile
**Payload**: Same as POST

#### `PATCH /user/profile/`
**Purpose**: Change user role to tutor
**Payload**:
```json
{
  "role": "tutor"
}
```

### 2. Tutor Dashboard Analytics

#### `GET /tutor/analytics/?period={period}`
**Purpose**: Get tutor performance metrics and analytics
**Query Parameters**: `period` (week, month, quarter, year)
**Response**:
```json
{
  "total_students": 45,
  "total_sessions": 128,
  "total_earnings": 2840.50,
  "average_rating": 4.8,
  "completion_rate": 92.0,
  "total_courses": 6,
  "monthly_growth": 15.2,
  "popular_subjects": [{"subject": "Mathematics", "sessions": 45}],
  "recent_performance": [{"date": "2024-01-01", "sessions": 8, "earnings": 180}]
}
```

### 3. Tutor Assignments Management

#### `GET /tutor/assignments/`
**Purpose**: List all assignments created by the tutor
**Response**: Array of assignments with submission counts and completion rates

#### `POST /tutor/assignments/`
**Purpose**: Create a new assignment
**Payload**:
```json
{
  "title": "Calculus Integration Assignment",
  "description": "Complete problems 1-10 from Chapter 5",
  "course": 1,
  "due_date": "2024-01-20T23:59:00Z",
  "max_score": 100.00,
  "is_published": true
}
```

#### `PATCH /tutor/assignments/{id}/`
**Purpose**: Update an existing assignment
**Payload**: Same as POST

#### `DELETE /tutor/assignments/{id}/`
**Purpose**: Delete an assignment

### 4. Course Management System

#### `GET /tutor/courses/me/`
**Purpose**: Get courses assigned to or created by the tutor
**Response**: Array of courses with enrollment counts and module information

#### `PATCH /tutor/courses/{course_id}/edit/`
**Purpose**: Edit assigned course metadata
**Payload**:
```json
{
  "title": "Advanced Mathematics",
  "description": "Comprehensive course covering calculus and algebra",
  "category": "Mathematics",
  "level": "Advanced",
  "duration": 120,
  "price": 99.99,
  "is_free": false
}
```

#### `POST /tutor/courses/{course_id}/modules/`
**Purpose**: Create a new module
**Payload**:
```json
{
  "title": "Calculus Fundamentals",
  "order": 1
}
```

#### `PATCH /tutor/modules/{module_id}/edit/`
**Purpose**: Edit module
**Payload**:
```json
{
  "title": "Calculus Fundamentals",
  "order": 1
}
```

#### `DELETE /tutor/modules/{module_id}/`
**Purpose**: Delete module

#### `POST /tutor/modules/{module_id}/lessons/`
**Purpose**: Create a new lesson
**Payload**:
```json
{
  "title": "Derivatives",
  "content": "Lesson content about derivatives...",
  "order": 1,
  "resources": []
}
```

#### `PATCH /tutor/lessons/{lesson_id}/edit/`
**Purpose**: Edit lesson
**Payload**:
```json
{
  "title": "Derivatives",
  "content": "Updated lesson content...",
  "order": 1,
  "resources": []
}
```

#### `DELETE /tutor/lessons/{lesson_id}/`
**Purpose**: Delete lesson

### 5. Availability Management

#### `GET /tutor/availability/`
**Purpose**: Get tutor's availability schedule
**Response**: Weekly availability with time slots

#### `POST /tutor/availability/`
**Purpose**: Create availability time slots
**Payload**:
```json
{
  "day_of_week": 0,
  "start_time": "09:00",
  "end_time": "10:00",
  "is_active": true
}
```

#### `PATCH /tutor/availability/{id}/`
**Purpose**: Update availability slot
**Payload**: Same as POST

#### `DELETE /tutor/availability/{id}/`
**Purpose**: Remove availability slot

### 6. Student Management

#### `GET /tutor/students/`
**Purpose**: Get list of students for the tutor
**Response**: Array of students with progress, ratings, and session information

#### `GET /tutor/courses/{course_id}/enrollments/`
**Purpose**: Get course enrollments
**Response**: Array of student enrollments

#### `GET /tutor/courses/{course_id}/progress/`
**Purpose**: Get student progress in course
**Response**: Student progress data

### 7. Earnings Management

#### `GET /tutor/earnings/?period={period}`
**Purpose**: Get tutor earnings and transaction history
**Query Parameters**: `period` (week, month, quarter, year)
**Response**: Earnings data, transaction history, and monthly breakdown

### 8. Tutor Messaging System

#### `GET /tutor/messages/`
**Purpose**: List all conversations with students
**Response**: Array of conversations with last message and unread counts

### 9. Tutoring Marketplace

#### `GET /tutoring/sessions/?as=tutor&status={status}`
**Purpose**: Get tutoring sessions as tutor
**Query Parameters**: `as=tutor`, `status` (scheduled, in_progress, completed, cancelled)

#### `POST /tutoring/sessions/`
**Purpose**: Create new tutoring session
**Payload**:
```json
{
  "tutor": 1,
  "learner": 2,
  "scheduled_at": "2024-01-20T10:00:00Z",
  "duration_minutes": 60,
  "notes": "Mathematics tutoring session"
}
```

#### `PATCH /tutoring/sessions/{id}/`
**Purpose**: Update session status
**Payload**:
```json
{
  "status": "completed",
  "notes": "Session completed successfully"
}
```

### 10. Mentorship

#### `GET /mentorship/?status={status}&as=mentor`
**Purpose**: Get mentorship relationships
**Query Parameters**: `status`, `as=mentor`

#### `POST /mentorship/`
**Purpose**: Create mentorship relationship
**Payload**:
```json
{
  "mentor": 1,
  "mentee": 2,
  "topics": ["Mathematics", "Physics"],
  "goals": "Help with advanced calculus"
}
```

---

## 👨‍🎓 STUDENT API ENDPOINTS

### 1. Student Dashboard

#### `GET /student/dashboard/`
**Purpose**: Get student dashboard data including progress and upcoming sessions
**Response**:
```json
{
  "enrolled_courses": 5,
  "completed_courses": 12,
  "upcoming_sessions_count": 3,
  "total_study_hours": 84,
  "achievements_count": 15,
  "current_streak": 7,
  "progress_percentage": 68,
  "recent_courses": [
    {
      "id": 1,
      "title": "Advanced Mathematics",
      "progress": 75.0,
      "last_accessed": "2024-01-12T10:30:00Z"
    }
  ],
  "upcoming_sessions": [
    {
      "id": 1,
      "tutor_name": "Dr. Sarah Johnson",
      "subject": "Mathematics",
      "date": "2024-01-15",
      "time": "10:00:00"
    }
  ],
  "recent_achievements": [
    {
      "id": 1,
      "title": "Week Streak Champion",
      "description": "Studied for 7 consecutive days",
      "earned_date": "2024-01-12T00:00:00Z",
      "icon": "🔥"
    }
  ]
}
```

### 2. Student Sessions

#### `GET /student/sessions/`
**Purpose**: Get student's scheduled and completed sessions
**Response**: Array of sessions with tutor and subject information

#### `POST /student/sessions/`
**Purpose**: Book a new tutoring session
**Payload**:
```json
{
  "tutor": 7,
  "subject": "Mathematics",
  "scheduled_time": "2024-01-20T10:00:00Z",
  "duration": 60
}
```

#### `PATCH /student/sessions/{id}/`
**Purpose**: Update session details
**Payload**:
```json
{
  "scheduled_time": "2024-01-21T10:00:00Z",
  "duration": 90,
  "status": "cancelled"
}
```

#### `DELETE /student/sessions/{id}/`
**Purpose**: Cancel session

### 3. Find Tutors Feature

#### `GET /student/tutors/?subject={subject}&price_range={range}&sort_by={sort}`
**Purpose**: Search and filter available tutors
**Query Parameters**:
- `subject`: Subject filter (e.g., "Mathematics")
- `price_range`: Price range filter (e.g., "20-50")
- `sort_by`: Sort option (rating, price_low, price_high, experience, sessions)

**Response**: Array of tutors with profiles, ratings, and availability

### 4. Student Messages

#### `GET /student/messages/`
**Purpose**: List conversations with tutors
**Response**: Array of conversations with tutor information and last message

### 5. General Student Endpoints

#### `GET /user/profile/`
**Purpose**: Get own profile
**Response**: User profile data

#### `PATCH /user/profile/`
**Purpose**: Update profile
**Payload**: Profile fields to update

#### `GET /user/courses/enrolled/`
**Purpose**: Get enrolled courses
**Response**: Array of enrolled courses

#### `GET /user/courses/completed/`
**Purpose**: Get completed courses
**Response**: Array of completed courses

#### `GET /user/progress/`
**Purpose**: Get progress analytics
**Response**: Progress data

#### `GET /user/achievements/`
**Purpose**: Get achievements
**Response**: Array of achievements

#### `GET /streaks/me/`
**Purpose**: Get study streaks
**Response**: Streak data

#### `POST /streaks/me/`
**Purpose**: Ping activity for streak tracking
**Payload**: Empty or minimal data

---

## 🌐 COMMUNITY API ENDPOINTS

### 1. Enhanced Community Features

#### `POST /community/posts/{postId}/react/`
**Purpose**: Add or remove a reaction to a community post
**Payload**:
```json
{
  "reaction_type": "like"
}
```

#### `GET /community/posts/{postId}/reactions/`
**Purpose**: Get reaction counts for a post
**Response**: Reaction counts by type

#### `POST /community/threads/{threadId}/posts/{postId}/react/`
**Purpose**: Add or remove a reaction to a thread post
**Payload**:
```json
{
  "reaction_type": "like"
}
```

### 2. Enhanced Events System

#### `POST /community/events/`
**Purpose**: Create a new community event
**Payload**:
```json
{
  "title": "Study Group Session",
  "description": "Weekly mathematics study group",
  "is_virtual": true,
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "start_date": "2024-01-20",
  "start_time": "14:00",
  "end_date": "2024-01-20",
  "end_time": "16:00"
}
```

---

## 📊 REQUIRED DATA STRUCTURES

### User Roles
- Students can access student endpoints
- Tutors can access tutor endpoints (requires `role: "tutor"` and `is_verified_tutor: true`)
- Both can access community endpoints

### Authentication
- All endpoints require valid JWT token in Authorization header
- Token should be included as: `Authorization: Bearer {token}`

### Response Format
All endpoints should return data in this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Pagination
For list endpoints, include pagination when applicable:
```json
{
  "pagination": {
    "count": 100,
    "next": "url",
    "previous": "url"
  }
}
```

### Operational Notes
- All time fields use ISO format
- Duration is in minutes
- `day_of_week`: 0=Monday, 6=Sunday
- Send `Content-Type: application/json` for JSON; use `multipart/form-data` only when uploading `image`
- Tutors must be assigned and verified; otherwise 403 is returned from tutor endpoints

---

## 🎯 IMPLEMENTATION PRIORITY

### Priority 1 (Critical)
- User authentication and role management
- Basic profile management
- Messaging system
- Session booking

### Priority 2 (Important)
- Course and assignment management
- Availability scheduling
- Student progress tracking
- Basic analytics

### Priority 3 (Enhancement)
- Advanced analytics and reporting
- File upload system
- Real-time notifications
- Advanced search and filtering

---

This specification covers all the API endpoints required for the new frontend features. Implement these endpoints according to the specified payloads and response formats to ensure proper integration with the frontend.