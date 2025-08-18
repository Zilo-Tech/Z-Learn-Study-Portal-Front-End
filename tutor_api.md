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

### Data models involved
- `UserProfile` (fields: role, is_verified_tutor)
- `TutorProfile` (subjects[], hourly_rate, availability{}, bio, rating)
- `CourseTutorAssignment` (course, tutor, role, is_active, assigned_by, assigned_at)
- `Course` / `Module` / `Lesson`
- `TutoringSession`, `Mentorship`

### Endpoints

Tutor verification and profile
- GET `/tutors/profile/`
- POST `/tutors/profile/` { subjects[], hourly_rate, availability{}, bio? }
- PATCH `/tutors/profile/` { subjects?, hourly_rate?, availability?, bio? }
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

### Permissions
- Tutor-only actions require:
  - Authenticated user.
  - `UserProfile.role = "tutor"` and `UserProfile.is_verified_tutor = true`.
  - For course edit/module/lesson operations: active `CourseTutorAssignment` for that `course`.

### JSON examples

Assign a tutor to a course
```json
POST /api/courses/tutor-assignments/
{ "course": 1, "tutor": 7, "role": "editor" }

201
{ "id": 5, "course": 1, "course_title": "Advanced Physics", "tutor": 7, "tutor_username": "jane", "role": "editor", "is_active": true, "assigned_by": 1, "assigned_at": "2025-01-10T09:00:00Z" }
```

Edit a course (tutor)
```json
PATCH /api/tutor/courses/1/edit/
{ "title": "Advanced Physics (Updated)", "price": 60000 }

200
{ "id": 1, "title": "Advanced Physics (Updated)", "description": "...", "category": "Education", "level": "Expert", "duration": "14 weeks", "price": "60000.00", "instructor": "Dr. Paul", "image": null, "features": [], "is_free": false, "rating": 4.7, "reviews": 189, "hours": 52, "color": "#FF6B6B", "modules": [], "modules_count": 0 }
```

Create a module (tutor)
```json
POST /api/tutor/courses/1/modules/
{ "title": "Module 1: Mechanics", "order": 1 }

201
{ "id": 11, "title": "Module 1: Mechanics", "order": 1, "lessons": [] }
```

Create a lesson (tutor)
```json
POST /api/tutor/modules/11/lessons/
{ "title": "Vectors", "content": "Lesson content...", "order": 1, "resources": ["video", "notes"] }

201
{ "id": 80, "title": "Vectors", "content": "Lesson content...", "order": 1, "resources": ["video", "notes"] }
```

Edit a lesson (tutor)
```json
PATCH /api/tutor/lessons/80/edit/
{ "title": "Vectors (Updated)", "order": 2 }

200
{ "id": 80, "title": "Vectors (Updated)", "content": "Lesson content...", "order": 2, "resources": ["video", "notes"] }
```

### Operational notes
- Send `Content-Type: application/json` for JSON; use `multipart/form-data` only when uploading `image`.
- Tutors must be assigned and verified; otherwise 403 is returned from tutor endpoints.
- Assignment roles can be used later to gate specific actions (e.g., only `owner` can change `price`).

