# Murmur API - Twitter-like Backend

A Twitter-like social media backend built with NestJS, Prisma, and MySQL.

## 🚀 Features

- **User Management**: User profiles with follower/following counts
- **Murmurs**: Create, read, update, and delete short messages (280 characters max)
- **Timeline**: Personalized feed showing own murmurs and murmurs from followed users
- **Likes**: Like/unlike murmurs with duplicate prevention
- **Follow System**: Follow/unfollow users with relationship management
- **Pagination**: Timeline supports pagination (10 murmurs per page by default)
- **Authorization**: Only owners can edit/delete their own murmurs

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-podcast-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=test
   DATABASE_URL="mysql://root:your_password@localhost:3306/test"
   PORT=3000
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database** (optional, for testing)
   ```bash
   npx ts-node seed.ts
   ```

6. **Start the application**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication

For simplicity, this demo uses a header-based authentication. Include the `x-user-id` header in your requests:

```
x-user-id: 1
```

In production, replace this with JWT or session-based authentication.

---

### 📝 Murmurs

#### Get Timeline
```http
GET /api/murmurs?page=1&limit=10
Headers: x-user-id: 1
```

Returns timeline with own murmurs and murmurs from followed users.

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "content": "Hello world!",
      "createdAt": "2025-12-14T10:00:00.000Z",
      "updatedAt": "2025-12-14T10:00:00.000Z",
      "likeCount": 5,
      "likedByMe": true,
      "author": {
        "id": "2",
        "username": "alice",
        "displayName": "Alice Johnson"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Get Murmur by ID
```http
GET /api/murmurs/:id
```

#### Create Murmur
```http
POST /api/me/murmurs
Headers: x-user-id: 1
Content-Type: application/json

{
  "content": "This is my new murmur!"
}
```

#### Update Murmur
```http
PATCH /api/me/murmurs/:id
Headers: x-user-id: 1
Content-Type: application/json

{
  "content": "Updated content"
}
```

**Note:** Only the owner can update their murmur.

#### Delete Murmur
```http
DELETE /api/me/murmurs/:id
Headers: x-user-id: 1
```

**Note:** Only the owner can delete their murmur.

---

### ❤️ Likes

#### Like a Murmur
```http
POST /api/murmurs/:id/like
Headers: x-user-id: 1
```

**Response:** 204 No Content

**Rules:**
- Each user can only like a murmur once
- Returns 409 Conflict if already liked

#### Unlike a Murmur
```http
DELETE /api/murmurs/:id/like
Headers: x-user-id: 1
```

**Response:** 204 No Content

---

### 👥 Follow System

#### Follow a User
```http
POST /api/users/:id/follow
Headers: x-user-id: 1
```

**Response:** 204 No Content

**Rules:**
- Cannot follow yourself
- Can only follow each user once
- Returns 409 Conflict if already following

#### Unfollow a User
```http
DELETE /api/users/:id/follow
Headers: x-user-id: 1
```

**Response:** 204 No Content

---

### 👤 Users

#### Get Current User
```http
GET /api/me
Headers: x-user-id: 1
```

**Response:**
```json
{
  "id": "1",
  "username": "alice",
  "displayName": "Alice Johnson",
  "email": "alice@example.com",
  "createdAt": "2025-12-14T10:00:00.000Z",
  "followerCount": 10,
  "followingCount": 5
}
```

#### Get User by Username
```http
GET /api/users/:username
```

---

## 🧪 Testing with cURL

Here are some example cURL commands to test the API:

```bash
# Get timeline (replace 1 with your user ID from seed)
curl -H "x-user-id: 1" http://localhost:3000/api/murmurs?page=1&limit=10

# Create a murmur
curl -X POST -H "x-user-id: 1" -H "Content-Type: application/json" \
  -d '{"content":"Hello from cURL!"}' \
  http://localhost:3000/api/me/murmurs

# Get current user info
curl -H "x-user-id: 1" http://localhost:3000/api/me

# Follow a user (replace 2 with target user ID)
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/users/2/follow

# Like a murmur (replace 1 with murmur ID)
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/murmurs/1/like
```

## 🏗️ Project Structure

```
src/
├── common/
│   ├── decorators/        # Custom decorators (CurrentUser)
│   ├── dto/               # Common DTOs (Pagination)
│   ├── filters/           # Exception filters
│   ├── guards/            # Auth guards
│   └── services/          # Common services (Prisma)
├── murmur/
│   ├── dto/               # Murmur DTOs
│   ├── murmur.controller.ts
│   ├── murmur.service.ts
│   └── murmur.module.ts
├── users/
│   ├── dto/               # User DTOs
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── main.ts
```

## 🔐 Business Rules

1. **Murmur Ownership**: Only the owner can edit or delete their murmurs
2. **Like Constraints**: Each user can like a murmur only once
3. **Follow Constraints**: 
   - Users cannot follow themselves
   - Only one follow relationship per user pair
4. **Timeline**: Shows only own murmurs and murmurs from followed users
5. **Content Validation**: Murmurs must be 1-280 characters
6. **Pagination**: Default 10 items per page, configurable via query params

## 🚀 Deployment

For production deployment:

1. Set up a production MySQL database
2. Configure environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build the application: `npm run build`
5. Start with: `npm run start:prod`

## 📦 Technologies Used

- **NestJS**: Progressive Node.js framework
- **Prisma**: Next-generation ORM
- **MySQL**: Relational database
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Prisma team for the excellent ORM
- Twitter for the inspiration
