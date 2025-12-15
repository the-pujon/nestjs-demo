# JWT Authentication Guide

## Overview

This application uses JWT (JSON Web Token) based authentication with bcrypt for password hashing. No cookies are used - the frontend should store the JWT token in localStorage.

## Setup

1. Make sure your `.env` file contains the JWT configuration:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

2. Ensure your database is running and the schema is up to date.

## API Endpoints

### 1. Sign Up (Register)

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Validation Rules:**
- `username`: Required, minimum 3 characters
- `displayName`: Required, minimum 2 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Get Current User (Protected)

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": "1",
  "username": "johndoe"
}
```

## Frontend Implementation

### Storing the Token

After successful login or signup, store the token in localStorage:

```javascript
// After login/signup
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'securepassword123'
  })
});

const data = await response.json();

// Store token in localStorage
localStorage.setItem('accessToken', data.accessToken);

// Optionally store user info
localStorage.setItem('user', JSON.stringify(data.user));
```

### Making Authenticated Requests

Include the token in the Authorization header for protected routes:

```javascript
const token = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

const userData = await response.json();
```

### Logout

Simply remove the token from localStorage:

```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('user');
```

### Handling Token Expiration

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    }
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  }

  return response;
}
```

## Protecting Backend Routes

To protect any route in your NestJS application, use the `AuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api')
export class YourController {
  
  // Public route - no authentication required
  @Get('public')
  getPublicData() {
    return { message: 'This is public' };
  }

  // Protected route - requires authentication
  @Get('protected')
  @UseGuards(AuthGuard)
  getProtectedData(@CurrentUser() user: { id: bigint; username: string }) {
    return {
      message: 'This is protected',
      userId: user.id.toString(),
      username: user.username
    };
  }
}
```

### Using CurrentUser Decorator

The `@CurrentUser()` decorator extracts user information from the JWT token:

```typescript
@Post('create-post')
@UseGuards(AuthGuard)
async createPost(
  @CurrentUser() user: { id: bigint; username: string },
  @Body() postDto: CreatePostDto
) {
  // user.id contains the authenticated user's ID as BigInt
  // user.username contains the username
  return this.postService.create(user.id, postDto);
}
```

## Security Best Practices

1. **Change JWT Secret in Production**: Use a strong, randomly generated secret key
2. **Use HTTPS**: Always use HTTPS in production to prevent token interception
3. **Token Expiration**: Tokens expire after 7 days by default. Adjust `JWT_EXPIRES_IN` as needed
4. **Password Requirements**: Enforce strong password policies (minimum 6 characters in this example)
5. **Never log tokens**: Be careful not to log JWT tokens in production

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "username must be longer than or equal to 3 characters",
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

### Authentication Errors (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### Conflict Errors (409 Conflict)
```json
{
  "statusCode": 409,
  "message": "Username already exists"
}
```

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "displayName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Access Protected Route
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## JWT Token Structure

The JWT token payload contains:
```json
{
  "sub": "1",           // User ID as string
  "username": "johndoe", // Username
  "iat": 1639123456,     // Issued at timestamp
  "exp": 1639728256      // Expiration timestamp
}
```
