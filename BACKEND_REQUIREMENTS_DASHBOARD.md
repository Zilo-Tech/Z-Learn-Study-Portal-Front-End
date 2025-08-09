# Backend Requirements for Dashboard

## Overview
This document outlines all the data structures and API endpoints needed to support the Z-Learn dashboard functionality at `http://localhost:3000/dashboard`.

## Base Configuration
- **API Base URL**: `https://z-learn-study-portal-backend.onrender.com/api` (configurable via `NEXT_PUBLIC_API_URL`)
- **Authentication**: Bearer token in Authorization header
- **Content Type**: `application/json`

---

## 1. User Authentication & Profile

### 1.1 Login Endpoint
**Endpoint**: `POST /login-email/`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response**:
```json
{
  "access": "jwt_access_token_here",
  "refresh": "jwt_refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user123",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false,
    "is_active": true,
    "date_joined": "2024-01-15T10:30:00Z"
  }
}
```

### 1.2 User Profile Endpoint
**Endpoint**: `GET /user/profile/`

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response**:
```json
{
  "id": "1",
  "email": "user@example.com",
  "full_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "avatar": "https://example.com/avatars/user1.jpg",
  "bio": "Passionate learner focused on AI and technology",
  "is_instructor": false,
  "is_student": true,
  "date_joined": "2024-01-15T10:30:00Z",
  "courses_enrolled": 3,
  "courses_completed": 1,
  "achievements": 5
}
```

### 1.3 Token Refresh Endpoint
**Endpoint**: `POST /token/refresh/`

**Request Body**:
```json
{
  "refresh": "jwt_refresh_token_here"
}
```

**Response**:
```json
{
  "access": "new_jwt_access_token_here"
}
```

---

## 2. Courses Data

### 2.1 User's Enrolled Courses
**Endpoint**: `GET /user/courses/enrolled/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "results": [
    {
      "id": "ai-mastery",
      "title": "AI Mastery",
      "description": "Master the fundamentals of artificial intelligence",
      "progress": 65,
      "level": "Intermediate",
      "type": "AI Learning",
      "delivery_type": "self-paced", // or "instructor-led"
      "image": "https://example.com/images/ai-course.jpg",
      "career_path": "AI Specialist",
      "instructor": "Dr. Jane Smith",
      "total_modules": 8,
      "completed_modules": 5,
      "total_lessons": 32,
      "completed_lessons": 21,
      "estimated_hours": 40,
      "enrollment_date": "2024-01-15T10:30:00Z",
      "last_accessed": "2024-01-20T14:45:00Z",
      "is_completed": false,
      "completion_date": null,
      "certificate_url": null
    }
  ],
  "count": 3,
  "next": null,
  "previous": null
}
```

### 2.2 User's Completed Courses
**Endpoint**: `GET /user/courses/completed/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response**: Same structure as enrolled courses but with `is_completed: true`

### 2.3 All Available Courses (for browsing)
**Endpoint**: `GET /courses/`

**Query Parameters**:
- `level`: beginner, intermediate, advanced
- `type`: ai-learning, instructor-led
- `category`: programming, data-science, cybersecurity, etc.
- `search`: text search in title/description

**Response**:
```json
{
  "results": [
    {
      "id": "1",
      "title": "Cloud Architecture Fundamentals",
      "description": "Learn cloud computing and architecture principles",
      "level": "Beginner",
      "duration": "6 weeks",
      "features": ["Hands-on labs", "Real-world projects", "Certificate"],
      "category": "Cloud Computing",
      "price": 99.99,
      "rating": 4.8,
      "reviews": 1250,
      "hours": 25,
      "instructor": "Prof. Mike Johnson",
      "is_free": false,
      "image": "https://example.com/images/cloud-course.jpg",
      "color": "from-blue-500 to-purple-600"
    }
  ]
}
```

### 2.4 Course Details
**Endpoint**: `GET /courses/{courseId}/details/`

**Response**:
```json
{
  "id": "ai-mastery",
  "title": "AI Mastery",
  "description": "Comprehensive course on artificial intelligence fundamentals",
  "long_description": "This course covers machine learning, deep learning, neural networks...",
  "level": "Intermediate",
  "instructor": "Dr. Jane Smith",
  "instructor_bio": "PhD in Computer Science with 10+ years experience...",
  "instructor_avatar": "https://example.com/avatars/instructor1.jpg",
  "duration": "8 weeks",
  "hours": 40,
  "price": 149.99,
  "is_free": false,
  "features": ["AI-powered learning", "Interactive exercises", "Certificate"],
  "requirements": ["Basic programming knowledge", "High school mathematics"],
  "learning_outcomes": ["Understand ML algorithms", "Build neural networks"],
  "image": "https://example.com/images/ai-course.jpg",
  "modules": [
    {
      "id": "intro",
      "title": "Introduction to AI",
      "description": "Basic concepts and history",
      "order": 1,
      "lessons": [
        {
          "id": "1",
          "title": "What is AI?",
          "duration": "15 minutes",
          "type": "video"
        }
      ]
    }
  ]
}
```

---

## 3. Learning Progress & Analytics

### 3.1 User Learning Progress
**Endpoint**: `GET /user/progress/`

**Query Parameters**:
- `period`: daily, weekly, monthly
- `course_id`: specific course (optional)

**Response**:
```json
{
  "daily": [
    {
      "date": "2024-01-15",
      "time_spent": 45, // minutes
      "lessons_completed": 2,
      "progress_percentage": 10
    }
  ],
  "weekly": [
    {
      "week_start": "2024-01-15",
      "time_spent": 180, // minutes
      "lessons_completed": 8,
      "progress_percentage": 40
    }
  ],
  "monthly": [
    {
      "month": "2024-01",
      "time_spent": 720, // minutes
      "lessons_completed": 25,
      "progress_percentage": 75
    }
  ],
  "overall_stats": {
    "total_time_spent": 2400, // minutes
    "total_lessons_completed": 95,
    "average_daily_time": 30, // minutes
    "current_streak": 7, // days
    "longest_streak": 15 // days
  }
}
```

### 3.2 Course-Specific Progress
**Endpoint**: `GET /user/courses/{courseId}/progress/`

**Response**:
```json
{
  "course_id": "ai-mastery",
  "overall_progress": 65,
  "modules": [
    {
      "module_id": "intro",
      "title": "Introduction to AI",
      "progress": 100,
      "lessons": [
        {
          "lesson_id": "1",
          "title": "What is AI?",
          "completed": true,
          "completion_date": "2024-01-15T10:30:00Z",
          "time_spent": 18 // minutes
        }
      ]
    }
  ],
  "next_lesson": {
    "module_id": "ml-basics",
    "lesson_id": "3",
    "title": "Linear Regression"
  }
}
```

---

## 4. Achievements & Gamification

### 4.1 User Achievements
**Endpoint**: `GET /user/achievements/`

**Response**:
```json
{
  "achievements": [
    {
      "id": 1,
      "title": "AI Explorer",
      "description": "Completed your first AI-powered course",
      "icon": "🤖",
      "category": "course_completion",
      "points": 100,
      "date_earned": "2024-01-20T15:30:00Z",
      "rarity": "common" // common, rare, epic, legendary
    }
  ],
  "total_points": 850,
  "rank": "Silver",
  "next_rank": "Gold",
  "points_to_next_rank": 150
}
```

### 4.2 Available Achievements
**Endpoint**: `GET /achievements/`

**Response**:
```json
{
  "achievements": [
    {
      "id": 1,
      "title": "First Steps",
      "description": "Complete your first lesson",
      "icon": "👶",
      "category": "milestone",
      "points": 10,
      "requirements": "Complete 1 lesson",
      "rarity": "common"
    }
  ]
}
```

---

## 5. Study Sessions & Activity

### 5.1 Study Sessions
**Endpoint**: `GET /user/study-sessions/`

**Response**:
```json
{
  "sessions": [
    {
      "id": "session-123",
      "course_id": "ai-mastery",
      "course_title": "AI Mastery",
      "start_time": "2024-01-20T14:00:00Z",
      "end_time": "2024-01-20T15:30:00Z",
      "duration": 90, // minutes
      "lessons_completed": 3,
      "status": "completed" // active, completed, paused
    }
  ],
  "active_session": {
    "id": "session-124",
    "course_id": "cloud-architect",
    "start_time": "2024-01-20T16:00:00Z",
    "current_lesson": "vpc-setup"
  }
}
```

### 5.2 Create Study Session
**Endpoint**: `POST /user/study-sessions/`

**Request Body**:
```json
{
  "course_id": "ai-mastery"
}
```

**Response**:
```json
{
  "session_id": "session-125",
  "course_id": "ai-mastery",
  "start_time": "2024-01-20T17:00:00Z",
  "status": "active"
}
```

---

## 6. Dashboard Analytics

### 6.1 Dashboard Summary
**Endpoint**: `GET /user/dashboard/summary/`

**Response**:
```json
{
  "user": {
    "full_name": "John Doe",
    "avatar": "https://example.com/avatars/user1.jpg",
    "is_instructor": false,
    "courses_enrolled": 3,
    "courses_completed": 1,
    "achievements": 5,
    "current_streak": 7,
    "total_learning_time": 2400 // minutes
  },
  "recent_activity": [
    {
      "type": "lesson_completed",
      "course_title": "AI Mastery",
      "lesson_title": "Neural Networks Basics",
      "timestamp": "2024-01-20T14:30:00Z"
    }
  ],
  "upcoming_deadlines": [
    {
      "course_title": "Cloud Architecture",
      "assignment_title": "VPC Design Project",
      "due_date": "2024-01-25T23:59:59Z"
    }
  ]
}
```

**Note**: This endpoint is used by both the dashboard and the user profile sidebar for displaying dynamic user statistics.

---

## 7. Search & Filtering

### 7.1 Course Search
**Endpoint**: `GET /courses/search/`

**Query Parameters**:
- `q`: search query
- `level`: beginner, intermediate, advanced
- `type`: ai-learning, instructor-led
- `category`: programming, data-science, etc.
- `price_min`: minimum price
- `price_max`: maximum price
- `rating_min`: minimum rating (1-5)

---

## 8. Error Handling

All endpoints should follow consistent error response format:

```json
{
  "error": true,
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {
    "field": ["Specific field error message"]
  }
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## 9. Real-time Features (Optional)

### 9.1 WebSocket Endpoints
For real-time updates on progress and notifications:

- **Connection**: `ws://localhost:8000/ws/user/{user_id}/`
- **Messages**: Progress updates, new achievements, course notifications

---

## 10. Data Models Summary

### User Model Fields Required:
- `id`, `email`, `full_name`, `first_name`, `last_name`
- `avatar`, `bio`, `is_instructor`, `is_student`
- `date_joined`, `courses_enrolled`, `courses_completed`, `achievements`

### Course Model Fields Required:
- `id`, `title`, `description`, `level`, `duration`, `hours`
- `instructor`, `price`, `is_free`, `rating`, `reviews`
- `features`, `category`, `image`, `color`

### Enrollment Model Fields Required:
- `user`, `course`, `enrollment_date`, `progress`
- `is_completed`, `completion_date`, `last_accessed`

### Achievement Model Fields Required:
- `id`, `title`, `description`, `icon`, `category`
- `points`, `rarity`, `requirements`

### Progress Model Fields Required:
- `user`, `course`, `lesson`, `completion_date`
- `time_spent`, `completed`

This document provides all the backend endpoints and data structures needed to support the dashboard functionality shown in the frontend code.