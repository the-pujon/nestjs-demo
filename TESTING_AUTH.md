# Testing Authentication Endpoints

## Using Postman or Thunder Client

### 1. Test Sign Up

**URL:** `POST http://localhost:3000/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "alice",
  "displayName": "Alice Smith",
  "email": "alice@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "alice",
    "displayName": "Alice Smith",
    "email": "alice@example.com"
  }
}
```

### 2. Test Login

**URL:** `POST http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "alice",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "alice",
    "displayName": "Alice Smith",
    "email": "alice@example.com"
  }
}
```

### 3. Test Protected Endpoint

**URL:** `GET http://localhost:3000/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "id": "1",
  "username": "alice"
}
```

### 4. Test Protected User Endpoint

**URL:** `GET http://localhost:3000/api/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "id": "1",
  "username": "alice",
  "displayName": "Alice Smith",
  "email": "alice@example.com",
  "createdAt": "2025-12-15T...",
  "followerCount": 0,
  "followingCount": 0
}
```

## Common Test Scenarios

### Test Invalid Credentials
```json
POST /auth/login
{
  "username": "alice",
  "password": "wrongpassword"
}
```
Expected: 401 Unauthorized

### Test Duplicate Username
```json
POST /auth/signup
{
  "username": "alice",  // Already exists
  "displayName": "Another Alice",
  "email": "alice2@example.com",
  "password": "password123"
}
```
Expected: 409 Conflict

### Test Invalid Token
```
GET /auth/me
Authorization: Bearer invalid_token_here
```
Expected: 401 Unauthorized

### Test Missing Token
```
GET /auth/me
(No Authorization header)
```
Expected: 401 Unauthorized

### Test Validation Errors
```json
POST /auth/signup
{
  "username": "ab",  // Too short (min 3)
  "displayName": "A",  // Too short (min 2)
  "email": "invalid-email",  // Invalid format
  "password": "12345"  // Too short (min 6)
}
```
Expected: 400 Bad Request with validation messages
