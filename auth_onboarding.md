## Auth & Onboarding API (Frontend Guide)

Base: `/api/`. All requests use JSON unless noted. Time values are ISO strings.

### Signup with Onboarding
- POST `/register/`
- Purpose: Create a new user and capture onboarding details in one request. Sends activation email; account is inactive until activated.
- Content-Type: `application/json`

Request body (fields marked optional are not required):
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Passw0rd!",
  "confirm_password": "Passw0rd!",
  "role": "learner",               // "learner" (default) | "tutor"
  "bio": "Learning web dev",       // optional
  "interests": ["python", "django"], // optional
  "location": "FR",                // optional
  "phone": "+33 6 12 34 56 78",    // optional
  "timezone": "Europe/Paris",      // optional
  "referral_code": "FRIEND10",     // optional

  // Tutor-only onboarding (send only if role == "tutor")
  "tutor_subjects": ["python", "algorithms"],          // optional (defaults to [])
  "tutor_hourly_rate": 25.0,                             // optional (defaults to 0)
  "tutor_availability": {"mon": ["18:00-20:00"]},      // optional (defaults to {})
  "tutor_years_experience": 5,                           // optional (defaults to 0)
  "tutor_education": "PhD Computer Science",            // optional
  "tutor_languages": ["English", "French"],            // optional (defaults to [])
  "tutor_certifications": ["Teaching Certificate"]      // optional (defaults to [])
}
```

Responses:
```json
201
{ "message": "User registered successfully. Please check your email to activate your account." }

400
{ "confirm_password": ["Passwords do not match." ] }

400
{ "email": ["Email already exists."] }
```

Notes:
- Creates `User`, `UserProfile` (role set to provided value; defaults to `learner`), and if `role == "tutor"`, creates `TutorProfile` populated from tutor fields. New users are `is_active=false` until activation.
- An activation email is sent with a link to activate the account.

### Account Activation
- GET `/activate/{uid}/{token}/`
- Purpose: Activates the account from the email link.
- Response: 200 on success, 400 on invalid/expired token.

### Login
- POST `/token/`
- Purpose: Obtain JWT via username + password (username is auto-derived from email at signup).
- Body:
```json
{ "username": "jane", "password": "Passw0rd!" }
```
- Response:
```json
{ "access": "<jwt>", "refresh": "<jwt>" }
```

- POST `/login-email/`
- Purpose: Obtain JWT via email + password (email-based login).
- Body:
```json
{ "email": "jane@example.com", "password": "Passw0rd!" }
```
- Response: same as above.

### Forgot/Reset Password
- POST `/forgot-password/` body: `{ "email": "jane@example.com" }`
  - Sends reset email with link: `/reset-password/{uid}/{token}/`
- POST `/reset-password/{uid}/{token}/` body: `{ "password": "NewPassw0rd!" }`

### Profile after Signup
- GET `/user/profile/`
- Response:
```json
{
  "id": 7,
  "username": "jane",
  "email": "jane@example.com",
  "role": "tutor",
  "bio": "Learning web dev",
  "avatar": null,
  "interests": ["python", "django"],
  "location": "FR",
  "is_verified_tutor": false
}
```

- PATCH `/user/profile/`
  - Content-Type: `application/json` or `multipart/form-data` (when sending `avatar`)
  - Body (any subset): `{ "role": "tutor", "bio": "...", "interests": ["..."], "location": "..." }`

- GET `/tutors/profile/`
- POST `/tutors/profile/` (for tutors who didn’t send tutor fields at signup)
```json
{
  "subjects": ["python", "algorithms"],
  "hourly_rate": 25.0,
  "availability": {"mon": ["18:00-20:00"]},
  "bio": "I tutor beginners",
  "years_experience": 5,
  "education": "PhD Computer Science",
  "languages": ["English", "French"],
  "certifications": ["Teaching Certificate"]
}
```

### Examples
- Learner signup
```json
POST /api/register/
{
  "full_name": "John Learner",
  "email": "johnl@example.com",
  "password": "Passw0rd!",
  "confirm_password": "Passw0rd!",
  "role": "learner",
  "bio": "Interested in Data Science",
  "interests": ["python", "ml"],
  "timezone": "UTC"
}
```

- Tutor signup (one-shot onboarding)
```json
POST /api/register/
{
  "full_name": "Jane Tutor",
  "email": "jane@example.com",
  "password": "Passw0rd!",
  "confirm_password": "Passw0rd!",
  "role": "tutor",
  "bio": "Experienced Python tutor",
  "interests": ["python", "algorithms"],
  "location": "FR",
  "tutor_subjects": ["python", "algorithms"],
  "tutor_hourly_rate": 25.0,
  "tutor_availability": {"mon": ["18:00-20:00"], "sat": ["10:00-12:00"]},
  "tutor_years_experience": 5,
  "tutor_education": "PhD Computer Science",
  "tutor_languages": ["English", "French"],
  "tutor_certifications": ["Teaching Certificate"]
}
```

### Validation & Errors
- Password mismatch → `400 { "confirm_password": ["Passwords do not match."] }`
- Email taken → `400 { "email": ["Email already exists."] }`
- Invalid field types → DRF validation error per field.

### Frontend Flow Tips
- After 201 signup, show a “Check your email” screen. Once activated, redirect to login.
- If role is `tutor`, show a “pending verification” badge until `is_verified_tutor` is true.
- Store `access`/`refresh` from login; attach `Authorization: Bearer <access>` to subsequent requests.