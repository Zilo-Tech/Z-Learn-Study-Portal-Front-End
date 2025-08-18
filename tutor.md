## Tutor Capabilities and API (Z-Learn)

Base: `/api/`. Auth: Bearer JWT.

### Tutor roles and verification
- A user becomes a tutor by creating a `TutorProfile` and setting `UserProfile.role = "tutor"`.
- Tutors must be verified/approved: `UserProfile.is_verified_tutor = true`.
- Only verified tutors can perform tutor-only actions below.

### Capabilities
- Manage tutoring marketplace sessions (request/confirm/complete/cancel).
- Get mentor/mentee matches via Mentorship.
- Edit assigned courses (metadata), create modules and lessons, and edit lessons.
- Be assigned to courses with roles: `owner`, `editor`, `assistant`.
- Host community events for groups they moderate/own (general capability; not strictly tutor-only).
- Post and moderate within assigned groups (if moderator).
- Create and manage assignments for students.
- Set availability schedules.
- Track earnings and analytics.
- Manage student relationships.

### Data models involved
- `UserProfile` (fields: role, is_verified_tutor)
- `TutorProfile` (subjects[], hourly_rate, availability{}, bio, rating, years_experience, education, certifications[], languages[])
- `CourseTutorAssignment` (course, tutor, role, is_active, assigned_by, assigned_at)
- `TutorAssignment` (title, description, course, due_date, max_score, is_published)
- `TutorAvailability` (day_of_week, start_time, end_time, is_active)
- `TutorEarning` (amount, session, description, status)
- `Course` / `Module` / `Lesson`
- `TutoringSession`, `Mentorship`

### Endpoints

Tutor verification and profile
- GET `/tutors/profile/`
- POST `/tutors/profile/` { subjects[], hourly_rate, availability{}, bio?, years_experience?, education?, certifications[]?, languages[]? }
- PATCH `/tutors/profile/` { subjects?, hourly_rate?, availability?, bio?, years_experience?, education?, certifications?, languages? }
- PATCH `/user/profile/` { role: "tutor" } (role change); verification is admin-driven by setting `is_verified_tutor` true.

Course tutor assignments
- GET `/courses/tutor-assignments/?course={courseId}&tutor={tutorId}`
- POST `/courses/tutor-assignments/` { course, tutor, role?="editor", is_active? }
- PATCH `/courses/tutor-assignments/{id}/` { role?, is_active? }
- DELETE `/courses/tutor-assignments/{id}/`

Editing assigned courses (verified tutors only)
- PATCH `/tutor/courses/{course_id}/edit/` { title?, description?, category?, level?, duration?, price?, instructor?, image?, features?, is_free?, color? }
  - Use `multipart/form-data` if sending `image`.
- POST `/tutor/courses/{course_id}/modules/` { title, order }
- PATCH `/tutor/modules/{module_id}/edit/` { title?, order? }
- DELETE `/tutor/modules/{module_id}/`
- POST `/tutor/modules/{module_id}/lessons/` { title, content, order, resources[]? }
- PATCH `/tutor/lessons/{lesson_id}/edit/` { title?, content?, order?, resources?[] }
- DELETE `/tutor/lessons/{lesson_id}/`

Assessments (verified tutors only)
- POST `/tutor/courses/{course_id}/assessments/` { title, description? }
- PATCH `/tutor/assessments/{assessment_id}/edit/` { title?, description? }
- DELETE `/tutor/assessments/{assessment_id}/`
- POST `/tutor/assessments/{assessment_id}/questions/` { text, choices[], correct_answer, explanation? }
- PATCH `/tutor/questions/{question_id}/edit/` { text?, choices?, correct_answer?, explanation? }
- DELETE `/tutor/questions/{question_id}/`

Tutor assignments (homework/tasks)
- GET `/tutor/assignments/` (list tutor's assignments)
- POST `/tutor/assignments/` { title, description, course, due_date, max_score?, is_published? }
- PATCH `/tutor/assignments/{id}/` { title?, description?, due_date?, max_score?, is_published? }
- DELETE `/tutor/assignments/{id}/`

Tutor availability
- GET `/tutor/availability/` (list tutor's availability)
- POST `/tutor/availability/` { day_of_week, start_time, end_time, is_active? }
- PATCH `/tutor/availability/{id}/` { day_of_week?, start_time?, end_time?, is_active? }
- DELETE `/tutor/availability/{id}/`

Tutor analytics and earnings
- GET `/tutor/analytics/?period={week|month|quarter|year}`
- GET `/tutor/earnings/?period={week|month|quarter|year}`

Student management
- GET `/tutor/students/` (list tutor's students)
- GET `/tutor/courses/{course_id}/enrollments/` (course enrollments)
- GET `/tutor/courses/{course_id}/progress/` (student progress in course)

Tutoring marketplace
- GET `/tutoring/sessions/?as=tutor|learner&status=`
- POST `/tutoring/sessions/` { tutor, learner?, scheduled_at, duration_minutes?, notes? }
- PATCH `/tutoring/sessions/{id}/` { status, scheduled_at?, duration_minutes?, notes? }
- DELETE `/tutoring/sessions/{id}/`

Mentorship
- GET `/mentorship/?status=&as=mentor|mentee`
- POST `/mentorship/` { mentor, mentee, topics[]?, goals? }
- PATCH `/mentorship/{id}/` { status }

My assignments and courses
- GET `/tutor/assignments/me/`
- GET `/tutor/courses/me/`

Tutor messaging
- GET `/tutor/messages/` (conversations with students)

### Permissions
- Tutor-only actions require:
  - Authenticated user.
  - `UserProfile.role = "tutor"` and `UserProfile.is_verified_tutor = true`.
  - For course edit/module/lesson operations: active `CourseTutorAssignment` for that `course`.

### JSON examples

Create tutor profile with extended fields
```json
POST /api/tutors/profile/
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

201
{
  "id": 3,
  "user": 7,
  "username": "jane",
  "subjects": ["python", "algorithms"],
  "hourly_rate": "25.00",
  "availability": {"mon": ["18:00-20:00"], "sat": ["10:00-12:00"]},
  "bio": "Experienced tutor",
  "rating": 0.0,
  "years_experience": 5,
  "education": "PhD Computer Science",
  "certifications": ["Teaching Certificate", "Python Expert"],
  "languages": ["English", "French"]
}
```

Create tutor assignment
```json
POST /api/tutor/assignments/
{
  "title": "Calculus Integration Assignment",
  "description": "Complete problems 1-10 from Chapter 5",
  "course": 1,
  "due_date": "2024-01-20T23:59:00Z",
  "max_score": 100.00,
  "is_published": true
}

201
{
  "id": 5,
  "tutor": 7,
  "tutor_username": "jane",
  "title": "Calculus Integration Assignment",
  "description": "Complete problems 1-10 from Chapter 5",
  "course": 1,
  "course_title": "Advanced Mathematics",
  "due_date": "2024-01-20T23:59:00Z",
  "max_score": "100.00",
  "is_published": true,
  "created_at": "2025-01-10T10:00:00Z",
  "updated_at": "2025-01-10T10:00:00Z"
}
```

Set availability
```json
POST /api/tutor/availability/
{
  "day_of_week": 0,
  "start_time": "09:00",
  "end_time": "10:00"
}

201
{
  "id": 3,
  "tutor": 7,
  "tutor_username": "jane",
  "day_of_week": 0,
  "start_time": "09:00:00",
  "end_time": "10:00:00",
  "is_active": true,
  "created_at": "2025-01-10T10:00:00Z"
}
```

Get analytics
```json
GET /api/tutor/analytics/?period=month

200
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

### Operational notes
- Send `Content-Type: application/json` for JSON; use `multipart/form-data` only when uploading `image`.
- Tutors must be assigned and verified; otherwise 403 is returned from tutor endpoints.
- Assignment roles can be used later to gate specific actions (e.g., only `owner` can change `price`).
- `day_of_week`: 0=Monday, 6=Sunday.
- All time fields use ISO format.

