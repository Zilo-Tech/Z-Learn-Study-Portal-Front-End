## Student API (Z-Learn)

Base: `/api/`. Auth: Bearer JWT.

### Student capabilities
- Access enrolled courses and track progress
- Book tutoring sessions with verified tutors
- Find and filter available tutors
- Access community features (groups, threads, feed)
- Track study streaks and achievements
- Manage messaging with tutors
- View personalized dashboard

### Data models involved
- `UserProfile` (role: "learner" by default)
- `UserCourseEnrollment` (course enrollments)
- `UserProgress` (lesson completion tracking)
- `StudentDashboard` (study metrics)
- `StudentSession` (tutoring sessions)
- `Achievement` (gamification)
- `StudyStreak` (daily activity tracking)

### Endpoints

Student Dashboard
- GET `/student/dashboard/` → Comprehensive dashboard data

Student Sessions
- GET `/student/sessions/` (list student's sessions)
- POST `/student/sessions/` { tutor, subject, scheduled_time, duration? }
- PATCH `/student/sessions/{id}/` { scheduled_time?, duration?, status? }
- DELETE `/student/sessions/{id}/`

Find Tutors
- GET `/student/tutors/?subject={subject}&price_range={range}&sort_by={sort}`

Student Messages
- GET `/student/messages/` (conversations with tutors)

General endpoints (also available to students)
- GET `/user/profile/` (own profile)
- PATCH `/user/profile/` (update profile)
- GET `/user/courses/enrolled/` (enrolled courses)
- GET `/user/courses/completed/` (completed courses)
- GET `/user/progress/` (progress analytics)
- GET `/user/achievements/` (achievements)
- GET `/streaks/me/` (study streaks)
- POST `/streaks/me/` (ping activity)

Community endpoints
- All community features: groups, threads, feed, events, etc.

### JSON examples

Get student dashboard
```json
GET /api/student/dashboard/

200
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

Book tutoring session
```json
POST /api/student/sessions/
{
  "tutor": 7,
  "subject": "Mathematics",
  "scheduled_time": "2024-01-20T10:00:00Z",
  "duration": 60
}

201
{
  "id": 15,
  "student": 9,
  "student_username": "john",
  "tutor": 7,
  "tutor_username": "jane",
  "subject": "Mathematics",
  "scheduled_time": "2024-01-20T10:00:00Z",
  "duration": 60,
  "status": "scheduled",
  "created_at": "2025-01-10T10:00:00Z"
}
```

Find tutors
```json
GET /api/student/tutors/?subject=Mathematics&price_range=20-50&sort_by=rating

200
[
  {
    "id": 3,
    "user": 7,
    "username": "jane",
    "subjects": ["python", "algorithms", "Mathematics"],
    "hourly_rate": "25.00",
    "availability": {"mon": ["18:00-20:00"], "sat": ["10:00-12:00"]},
    "bio": "Experienced tutor",
    "rating": 4.9,
    "years_experience": 5,
    "education": "PhD Computer Science",
    "certifications": ["Teaching Certificate", "Python Expert"],
    "languages": ["English", "French"]
  }
]
```

Get student messages
```json
GET /api/student/messages/

200
[
  {
    "id": 6,
    "tutor": {
      "id": 7,
      "name": "Jane Doe",
      "subjects": ["python", "algorithms"]
    },
    "last_message": {
      "id": 101,
      "conversation": 6,
      "sender": 7,
      "sender_username": "jane",
      "content": "Sure, let's schedule!",
      "created_at": "2025-01-10T12:01:00Z",
      "is_read": false
    },
    "unread_count": 1
  }
]
```

### Permissions
- Student endpoints require authenticated user
- Students can only access their own data
- Community features follow group visibility rules

### Operational notes
- All time fields use ISO format
- Duration is in minutes
- Subject should match tutor's subjects for better matching
- Dashboard data is calculated in real-time
- Study streaks require daily activity pings 