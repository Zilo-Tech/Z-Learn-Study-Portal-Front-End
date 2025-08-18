## Z-Learn Frontend API Reference (Community & Roles)

Base: `/api/`. Auth: Bearer JWT unless stated.

### Important notes to avoid 400 Bad Request
- Always send `Content-Type: application/json` for JSON endpoints.
- For file/image fields (e.g., `avatar`, `resources.file`), use `multipart/form-data`.
- Provide numeric IDs for foreign keys (e.g., `group`, `thread`, `question`).
- Reactions require a numeric `content_type` ID (from Django ContentTypes), not a string like `"api.feedpost"`.
- Do not send server-populated fields: `author`, `created_by`, `sender`, `asked_by`, `user` (for some endpoints). These are set from the authenticated user.
- PATCH is partial: include only fields you want to update.

### Auth & Profiles
- POST `/register/` { full_name, email, password, confirm_password }
- POST `/token/` { username, password } → { access, refresh }
- GET `/user/profile/` → UserProfile
- PATCH `/user/profile/` { role?, bio?, avatar?, interests?, location? }
- GET `/tutors/profile/` → TutorProfile
- POST `/tutors/profile/` { subjects[], hourly_rate, availability{}, bio? }
- PATCH `/tutors/profile/` { subjects?, hourly_rate?, availability?, bio? }

UserProfile: { id, username, email, role, bio, avatar, interests[], location, is_verified_tutor }
TutorProfile: { id, user, username, subjects[], hourly_rate, availability{}, bio, rating }

### Follow System
- POST `/users/{userId}/follow/`
- DELETE `/users/{userId}/follow/`
- GET `/users/{userId}/followers/`
- GET `/users/{userId}/following/`

Follow: { id, follower, follower_username, following, following_username, created_at }

### Groups
- GET `/groups/`
- POST `/groups/` { name, description?, is_public?, tags[], region? }
- GET `/groups/{id}/`
- PATCH `/groups/{id}/` { name?, description?, is_public?, tags?, region?, moderators?[] }
- DELETE `/groups/{id}/`

CommunityGroup: { id, name, description, owner, owner_username, moderators[], is_public, tags[], region, created_at, updated_at }

### Group Memberships
- GET `/group-memberships/?groupId={gid}`
- POST `/group-memberships/` { user, group, role?, status? }
- PATCH `/group-memberships/{id}/` { role?, status? }
- DELETE `/group-memberships/{id}/`

GroupMembership: { id, user, username, group, group_name, role, status, joined_at }

### Threads & Posts
- GET `/threads/?group={gid}`
- POST `/threads/` { title, category?, group }
- GET `/threads/{id}/`
- PATCH `/threads/{id}/` { title?, category?, is_locked?, is_pinned? }
- DELETE `/threads/{id}/`

- GET `/thread-posts/?thread={tid}`
- POST `/thread-posts/` { thread, content, attachments[]?, parent? }
- PATCH `/thread-posts/{id}/` { content?, attachments? }
- DELETE `/thread-posts/{id}/`

CommunityThread: { id, group, group_name, title, created_by, created_by_username, category, is_locked, is_pinned, created_at, updated_at }
ThreadPost: { id, thread, author, author_username, content, attachments[], parent, created_at, updated_at, is_edited }

### Feed & Comments
- GET `/feed/` (router list) query: author?, group?, visibility?
- POST `/feed/` { content, attachments[]?, visibility?="public"|"group"|"followers", group? }
- GET `/feed/{id}/`
- PATCH `/feed/{id}/` { content?, attachments?, visibility? }
- DELETE `/feed/{id}/`

- GET `/feed-comments/?post={postId}`
- POST `/feed-comments/` { post, content, parent? }
- PATCH `/feed-comments/{id}/` { content? }
- DELETE `/feed-comments/{id}/`

FeedPost: { id, author, author_username, group, group_name, content, attachments[], visibility, created_at, updated_at }
FeedComment: { id, post, author, author_username, content, parent, created_at, updated_at }

### Reactions (generic)
- GET `/reactions/?content_type={contentTypeId}&object_id={id}`
- POST `/reactions/` { content_type, object_id, type }
- DELETE `/reactions/{id}/`

Reaction: { id, user, content_type, object_id, type, created_at }
Note: `content_type` is a numeric ContentType ID. You can discover IDs via a simple admin or helper endpoint if needed.

### Direct Messages
- GET `/dm/conversations/`
- POST `/dm/conversations/` { participants: number[] }
- GET `/dm/conversations/{id}/`
- DELETE `/dm/conversations/{id}/`

- GET `/dm/messages/?conversation={cid}`
- POST `/dm/messages/` { conversation, content }
- PATCH `/dm/messages/{id}/` { is_read? }
- DELETE `/dm/messages/{id}/`

Conversation: { id, participants[], created_at }
DirectMessage: { id, conversation, sender, sender_username, content, created_at, is_read }

### Events
- GET `/events/?group={gid}&upcoming=true`
- POST `/events/` { title, description?, start_at, end_at, is_virtual?, meeting_url?, location?, group? }
- GET `/events/{id}/`
- PATCH `/events/{id}/` { ... }
- DELETE `/events/{id}/`

- GET `/event-attendees/?event={eventId}`
- POST `/event-attendees/` { event, user, rsvp }
- PATCH `/event-attendees/{id}/` { rsvp }
- DELETE `/event-attendees/{id}/`

CommunityEvent: { id, group, group_name, created_by, created_by_username, title, description, start_at, end_at, location, is_virtual, meeting_url, created_at }
EventAttendee: { id, event, user, username, rsvp, created_at }

### Mentorship
- GET `/mentorship/?status=&as=mentor|mentee`
- POST `/mentorship/` { mentor, mentee, topics[]?, goals? }
- PATCH `/mentorship/{id}/` { status }
- DELETE `/mentorship/{id}/`

Mentorship: { id, mentor, mentor_username, mentee, mentee_username, topics[], goals, status, created_at }

### Study Buddy
- GET `/study-buddy/preferences/`
- POST `/study-buddy/preferences/` { subjects[], availability{}, time_zone?, goals? }
- PATCH `/study-buddy/preferences/{id}/` { ... }
- GET `/study-buddy/matches/`
- POST `/study-buddy/matches/` { user_a, user_b }
- PATCH `/study-buddy/matches/{id}/` { status }

StudyBuddyPreference: { id, user, username, subjects[], availability{}, time_zone, goals }
StudyBuddyMatch: { id, user_a, user_a_username, user_b, user_b_username, status, created_at }

### Challenges
- GET `/challenges/?group={gid}&active=true`
- POST `/challenges/` { group?, title, description?, type, rules{}, start_at, end_at }
- PATCH `/challenges/{id}/` { ... }
- DELETE `/challenges/{id}/`

- GET `/challenge-participants/?challenge={id}`
- POST `/challenge-participants/` { challenge, user }
- PATCH `/challenge-participants/{id}/` { progress{}, score?, completed? }
- DELETE `/challenge-participants/{id}/`

LearningChallenge: { id, group, group_name, created_by, created_by_username, title, description, type, rules{}, start_at, end_at, created_at }
ChallengeParticipant: { id, challenge, user, username, progress{}, score, completed, created_at }

### Resources & Projects
- GET `/resources/?group={gid}&q=&tag=`
- POST `/resources/` { title, description?, file?, link?, tags[], group? }
- PATCH `/resources/{id}/` { ... }
- DELETE `/resources/{id}/`

- GET `/projects/?user={uid}&q=`
- POST `/projects/` { title, description, demo_url?, repo_url?, images[]? }
- PATCH `/projects/{id}/` { ... }
- DELETE `/projects/{id}/`

SharedResource: { id, author, author_username, group, group_name, title, description, file, link, tags[], created_at }
ProjectShowcase: { id, author, author_username, title, description, demo_url, repo_url, images[], created_at }

### Q&A
- GET `/qa/questions/?group={gid}&q=&tag=`
- POST `/qa/questions/` { group?, title, body, tags[]? }
- PATCH `/qa/questions/{id}/` { title?, body?, tags? }
- DELETE `/qa/questions/{id}/`

- GET `/qa/answers/?question={qid}`
- POST `/qa/answers/` { question, body }
- PATCH `/qa/answers/{id}/` { is_accepted? }
- DELETE `/qa/answers/{id}/`

QAQuestion: { id, group, group_name, asked_by, asked_by_username, title, body, tags[], created_at, updated_at, accepted_answer }
QAAnswer: { id, question, author, author_username, body, created_at, updated_at, is_accepted }

### Streaks
- GET `/streaks/me/`
- POST `/streaks/me/` { date? } (ping activity)

StudyStreak: { id, user, username, current_streak, longest_streak, last_activity_date }

### Tutoring Marketplace
- GET `/tutoring/sessions/?as=tutor|learner&status=`
- POST `/tutoring/sessions/` { tutor, learner?, scheduled_at, duration_minutes?, notes? }
- PATCH `/tutoring/sessions/{id}/` { status, scheduled_at?, duration_minutes?, notes? }
- DELETE `/tutoring/sessions/{id}/`

TutoringSession: { id, tutor, tutor_username, learner, learner_username, scheduled_at, duration_minutes, status, notes, created_at }

### Notes
- All list endpoints support pagination params: `?page=` and `?page_size=` if enabled.
- Filter query params shown are suggested; backend may accept additional filters per serializer fields.
- Errors follow `{ detail: string }` or standard DRF error objects.


### JSON Examples

#### Auth & Profiles
Register
```json
POST /api/register/
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Passw0rd!",
  "confirm_password": "Passw0rd!"
}

201
{
  "message": "User registered successfully. Please check your email to activate your account."
}
```

Login
```json
POST /api/token/
{
  "username": "jane", 
  "password": "Passw0rd!"
}

200
{
  "access": "<jwt>",
  "refresh": "<jwt>"
}
```

Get/Update profile
```json
GET /api/user/profile/
200
{
  "id": 7,
  "username": "jane",
  "email": "jane@example.com",
  "role": "learner",
  "bio": "Learning web dev",
  "avatar": "/media/avatars/jane.png",
  "interests": ["python", "django"],
  "location": "FR",
  "is_verified_tutor": false
}

PATCH /api/user/profile/
{
  "bio": "Full-stack learner",
  "role": "tutor"
}

200
{
  "id": 7,
  "username": "jane",
  "email": "jane@example.com",
  "role": "tutor",
  "bio": "Full-stack learner",
  "avatar": "/media/avatars/jane.png",
  "interests": ["python", "django"],
  "location": "FR",
  "is_verified_tutor": false
}
```

Tutor profile
```json
POST /api/tutors/profile/
{
  "subjects": ["python", "algorithms"],
  "hourly_rate": 25.0,
  "availability": {"mon": ["18:00-20:00"], "sat": ["10:00-12:00"]},
  "bio": "I tutor beginners"
}

201
{
  "id": 3,
  "user": 7,
  "username": "jane",
  "subjects": ["python", "algorithms"],
  "hourly_rate": "25.00",
  "availability": {"mon": ["18:00-20:00"], "sat": ["10:00-12:00"]},
  "bio": "I tutor beginners",
  "rating": 0.0
}
```

#### Follow System
```json
POST /api/users/9/follow/
201
{ "id": 12, "follower": 7, "follower_username": "jane", "following": 9, "following_username": "john", "created_at": "2025-01-10T10:00:00Z" }

GET /api/users/9/followers/
200
[
  { "id": 12, "follower": 7, "follower_username": "jane", "following": 9, "following_username": "john", "created_at": "2025-01-10T10:00:00Z" }
]
```

#### Groups
```json
POST /api/groups/
{
  "name": "Data Science Club",
  "description": "Learn DS together",
  "is_public": true,
  "tags": ["ml", "python"],
  "region": "EU"
}

201
{
  "id": 4,
  "name": "Data Science Club",
  "description": "Learn DS together",
  "owner": 7,
  "owner_username": "jane",
  "moderators": [],
  "is_public": true,
  "tags": ["ml", "python"],
  "region": "EU",
  "created_at": "2025-01-10T10:00:00Z",
  "updated_at": "2025-01-10T10:00:00Z"
}
```

#### Group Memberships
```json
POST /api/group-memberships/
{ "user": 7, "group": 4, "role": "member" }

201
{ "id": 22, "user": 7, "username": "jane", "group": 4, "group_name": "Data Science Club", "role": "member", "status": "active", "joined_at": "2025-01-10T10:00:00Z" }
```

#### Threads & Posts
```json
POST /api/threads/
{ "title": "Best ML books?", "category": "reading", "group": 4 }

201
{ "id": 15, "group": 4, "group_name": "Data Science Club", "title": "Best ML books?", "created_by": 7, "created_by_username": "jane", "category": "reading", "is_locked": false, "is_pinned": false, "created_at": "2025-01-10T10:00:00Z", "updated_at": "2025-01-10T10:00:00Z" }

POST /api/thread-posts/
{ "thread": 15, "content": "Start with Hands-On ML." }

201
{ "id": 30, "thread": 15, "author": 7, "author_username": "jane", "content": "Start with Hands-On ML.", "attachments": [], "parent": null, "created_at": "2025-01-10T10:01:00Z", "updated_at": "2025-01-10T10:01:00Z", "is_edited": false }
```

#### Feed & Comments
```json
POST /api/feed/
{ "content": "Just finished Module 1!", "visibility": "public" }

201
{ "id": 55, "author": 7, "author_username": "jane", "group": null, "group_name": null, "content": "Just finished Module 1!", "attachments": [], "visibility": "public", "created_at": "2025-01-10T11:00:00Z", "updated_at": "2025-01-10T11:00:00Z" }

POST /api/feed-comments/
{ "post": 55, "content": "Congrats!" }

201
{ "id": 9, "post": 55, "author": 9, "author_username": "john", "content": "Congrats!", "parent": null, "created_at": "2025-01-10T11:05:00Z", "updated_at": "2025-01-10T11:05:00Z" }
```

#### Reactions
```json
POST /api/reactions/
{ "content_type": 25, "object_id": 55, "type": "like" }

201
{ "id": 77, "user": 7, "content_type": 25, "object_id": 55, "type": "like", "created_at": "2025-01-10T11:06:00Z" }
```

#### Direct Messages
```json
POST /api/dm/conversations/
{ "participants": [7, 9] }

201
{ "id": 6, "participants": [7, 9], "created_at": "2025-01-10T12:00:00Z" }

POST /api/dm/messages/
{ "conversation": 6, "content": "Hey!" }

201
{ "id": 101, "conversation": 6, "sender": 7, "sender_username": "jane", "content": "Hey!", "created_at": "2025-01-10T12:01:00Z", "is_read": false }
```

#### Events & Attendance
```json
POST /api/events/
{ "title": "Weekly Study", "start_at": "2025-01-12T17:00:00Z", "end_at": "2025-01-12T18:00:00Z", "is_virtual": true, "meeting_url": "https://meet.example.com/abc", "group": 4 }

201
{ "id": 11, "group": 4, "group_name": "Data Science Club", "created_by": 7, "created_by_username": "jane", "title": "Weekly Study", "description": "", "start_at": "2025-01-12T17:00:00Z", "end_at": "2025-01-12T18:00:00Z", "location": "", "is_virtual": true, "meeting_url": "https://meet.example.com/abc", "created_at": "2025-01-10T12:30:00Z" }

POST /api/event-attendees/
{ "event": 11, "user": 9, "rsvp": "going" }

201
{ "id": 5, "event": 11, "user": 9, "username": "john", "rsvp": "going", "created_at": "2025-01-10T12:31:00Z" }
```

#### Mentorship
```json
POST /api/mentorship/
{ "mentor": 7, "mentee": 9, "topics": ["django"], "goals": "Build first app" }

201
{ "id": 3, "mentor": 7, "mentor_username": "jane", "mentee": 9, "mentee_username": "john", "topics": ["django"], "goals": "Build first app", "status": "requested", "created_at": "2025-01-10T13:00:00Z" }

PATCH /api/mentorship/3/
{ "status": "active" }

200
{ "id": 3, "mentor": 7, "mentor_username": "jane", "mentee": 9, "mentee_username": "john", "topics": ["django"], "goals": "Build first app", "status": "active", "created_at": "2025-01-10T13:00:00Z" }
```

#### Study Buddy
```json
POST /api/study-buddy/preferences/
{ "subjects": ["math"], "availability": {"sun": ["14:00-16:00"]}, "time_zone": "UTC", "goals": "Exam prep" }

201
{ "id": 2, "user": 7, "username": "jane", "subjects": ["math"], "availability": {"sun": ["14:00-16:00"]}, "time_zone": "UTC", "goals": "Exam prep" }

POST /api/study-buddy/matches/
{ "user_a": 7, "user_b": 9 }

201
{ "id": 8, "user_a": 7, "user_a_username": "jane", "user_b": 9, "user_b_username": "john", "status": "pending", "created_at": "2025-01-10T13:30:00Z" }
```

#### Challenges
```json
POST /api/challenges/
{ "title": "7-Day Streak", "type": "streak", "rules": {"days": 7}, "start_at": "2025-01-11T00:00:00Z", "end_at": "2025-01-18T00:00:00Z", "group": 4 }

201
{ "id": 14, "group": 4, "group_name": "Data Science Club", "created_by": 7, "created_by_username": "jane", "title": "7-Day Streak", "description": "", "type": "streak", "rules": {"days": 7}, "start_at": "2025-01-11T00:00:00Z", "end_at": "2025-01-18T00:00:00Z", "created_at": "2025-01-10T14:00:00Z" }

POST /api/challenge-participants/
{ "challenge": 14, "user": 9 }

201
{ "id": 3, "challenge": 14, "user": 9, "username": "john", "progress": {}, "score": 0, "completed": false, "created_at": "2025-01-10T14:05:00Z" }

PATCH /api/challenge-participants/3/
{ "progress": {"days": 1}, "score": 10 }

200
{ "id": 3, "challenge": 14, "user": 9, "username": "john", "progress": {"days": 1}, "score": 10, "completed": false, "created_at": "2025-01-10T14:05:00Z" }
```

#### Resources & Projects
```json
POST /api/resources/
{ "title": "Linear Algebra Notes", "description": "Week 1", "link": "https://example.com/notes.pdf", "tags": ["math"], "group": 4 }

201
{ "id": 19, "author": 7, "author_username": "jane", "group": 4, "group_name": "Data Science Club", "title": "Linear Algebra Notes", "description": "Week 1", "file": null, "link": "https://example.com/notes.pdf", "tags": ["math"], "created_at": "2025-01-10T15:00:00Z" }

POST /api/projects/
{ "title": "Digit Classifier", "description": "CNN on MNIST", "demo_url": "https://demo.example.com", "repo_url": "https://github.com/jane/digit-classifier", "images": [] }

201
{ "id": 5, "author": 7, "author_username": "jane", "title": "Digit Classifier", "description": "CNN on MNIST", "demo_url": "https://demo.example.com", "repo_url": "https://github.com/jane/digit-classifier", "images": [], "created_at": "2025-01-10T15:10:00Z" }
```

#### Q&A
```json
POST /api/qa/questions/
{ "title": "How to set up DRF?", "body": "Steps please", "tags": ["django", "drf"], "group": 4 }

201
{ "id": 40, "group": 4, "group_name": "Data Science Club", "asked_by": 7, "asked_by_username": "jane", "title": "How to set up DRF?", "body": "Steps please", "tags": ["django", "drf"], "created_at": "2025-01-10T16:00:00Z", "updated_at": "2025-01-10T16:00:00Z", "accepted_answer": null }

POST /api/qa/answers/
{ "question": 40, "body": "Install djangorestframework and add to INSTALLED_APPS." }

201
{ "id": 61, "question": 40, "author": 9, "author_username": "john", "body": "Install djangorestframework and add to INSTALLED_APPS.", "created_at": "2025-01-10T16:10:00Z", "updated_at": "2025-01-10T16:10:00Z", "is_accepted": false }
```

#### Streaks
```json
GET /api/streaks/me/
200
{ "id": 2, "user": 7, "username": "jane", "current_streak": 3, "longest_streak": 5, "last_activity_date": "2025-01-10" }

POST /api/streaks/me/
{}

200
{ "id": 2, "user": 7, "username": "jane", "current_streak": 4, "longest_streak": 5, "last_activity_date": "2025-01-11" }
```

#### Tutoring Sessions
```json
POST /api/tutoring/sessions/
{ "tutor": 7, "learner": 9, "scheduled_at": "2025-01-12T19:00:00Z", "duration_minutes": 60, "notes": "Intro lesson" }

201
{ "id": 9, "tutor": 7, "tutor_username": "jane", "learner": 9, "learner_username": "john", "scheduled_at": "2025-01-12T19:00:00Z", "duration_minutes": 60, "status": "requested", "notes": "Intro lesson", "created_at": "2025-01-10T17:00:00Z" }

PATCH /api/tutoring/sessions/9/
{ "status": "confirmed" }

200
{ "id": 9, "tutor": 7, "tutor_username": "jane", "learner": 9, "learner_username": "john", "scheduled_at": "2025-01-12T19:00:00Z", "duration_minutes": 60, "status": "confirmed", "notes": "Intro lesson", "created_at": "2025-01-10T17:00:00Z" }
```

