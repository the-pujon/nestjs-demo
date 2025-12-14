# 🐦 Murmur API - Twitter-like Backend

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

A production-ready Twitter-like social media backend built with **NestJS**, **Prisma**, and **MySQL**. Features a complete RESTful API for users, posts (murmurs), likes, follows, and personalized timelines.

---

## ✨ Features

🚀 **Complete Social Media Backend**
- ✅ User profiles with follower/following counts
- ✅ Create, edit, delete posts (murmurs) - 280 character limit
- ✅ Like/unlike posts with duplicate prevention
- ✅ Follow/unfollow users
- ✅ Personalized timeline with pagination
- ✅ Authorization (only owners can edit/delete their content)
- ✅ RESTful API design
- ✅ Global error handling

📊 **Smart Timeline**
- Shows your own posts
- Shows posts from people you follow
- Pagination support (10 per page, configurable)
- Sorted by creation date (newest first)

🔒 **Security & Validation**
- Input validation
- Authorization checks
- Content length limits
- Duplicate prevention (likes, follows)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MySQL database
- npm or yarn

### Installation

1. **Clone and install**
   ```bash
   cd my-podcast-api
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up database**
   ```bash
   npm run prisma:migrate
   npm run seed  # Optional: adds sample data
   ```

4. **Start the server**
   ```bash
   npm run start:dev
   ```

   Server runs at `http://localhost:3000`

---

## 📚 Documentation

- **[📖 API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[🚀 Quick Start Guide](./QUICKSTART.md)** - Step-by-step setup and testing
- **[🧪 Test Guide](./TEST_GUIDE.md)** - Test cases and cURL commands
- **[📋 Project Summary](./PROJECT_SUMMARY.md)** - Implementation details

---

## 🛣️ API Endpoints

### 📝 Murmurs (Posts)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/murmurs?page=1&limit=10` | Get personalized timeline |
| `GET` | `/api/murmurs/:id` | Get single murmur |
| `POST` | `/api/me/murmurs` | Create a murmur |
| `PATCH` | `/api/me/murmurs/:id` | Update own murmur |
| `DELETE` | `/api/me/murmurs/:id` | Delete own murmur |

### ❤️ Likes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/murmurs/:id/like` | Like a murmur |
| `DELETE` | `/api/murmurs/:id/like` | Unlike a murmur |

### 👥 Follow/Unfollow
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/:id/follow` | Follow a user |
| `DELETE` | `/api/users/:id/follow` | Unfollow a user |

### 👤 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/me` | Get current user info |
| `GET` | `/api/users/:username` | Get user by username |

---

## 🧪 Quick Test

```bash
# Get current user (use x-user-id from seed data)
curl -H "x-user-id: 1" http://localhost:3000/api/me

# Create a murmur
curl -X POST \
  -H "x-user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from Murmur API!"}' \
  http://localhost:3000/api/me/murmurs

# Get timeline
curl -H "x-user-id: 1" "http://localhost:3000/api/murmurs?page=1&limit=10"

# Follow a user
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/users/2/follow

# Like a murmur
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/murmurs/1/like
```

See [TEST_GUIDE.md](./TEST_GUIDE.md) for comprehensive test cases.

---

## 🏗️ Architecture

```
src/
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators (@CurrentUser)
│   ├── dto/             # Common DTOs (Pagination)
│   ├── filters/         # Exception filters
│   ├── guards/          # Auth guard
│   └── services/        # Prisma service
├── murmur/              # Murmur module
│   ├── dto/             # Murmur DTOs
│   ├── murmur.controller.ts
│   ├── murmur.service.ts
│   └── murmur.module.ts
├── users/               # Users module
│   ├── dto/             # User DTOs
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── main.ts              # App entry point
```

### Design Patterns
- **Modular Architecture**: Separate modules for concerns
- **Service Layer Pattern**: Business logic in services
- **DTO Pattern**: Type-safe data transfer
- **Guard Pattern**: Reusable authentication
- **Repository Pattern**: Prisma for data access

---

## 🔐 Business Rules

1. ✅ Only owners can edit/delete their murmurs
2. ✅ Each user can like a murmur only once
3. ✅ Users cannot follow themselves
4. ✅ Only one follow relationship per user pair
5. ✅ Timeline shows own + followed users' murmurs
6. ✅ Murmurs limited to 280 characters
7. ✅ Pagination default: 10 items per page

---

## 🛠️ NPM Scripts

```bash
# Development
npm run start:dev         # Start with hot reload
npm run prisma:studio     # Open Prisma Studio (DB GUI)

# Database
npm run prisma:migrate    # Run migrations
npm run prisma:generate   # Generate Prisma Client
npm run seed              # Seed database with sample data

# Production
npm run build             # Build for production
npm run start:prod        # Start production server

# Code Quality
npm run lint              # Run linter
npm run format            # Format code
npm test                  # Run tests
```

---

## 📦 Tech Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[MySQL](https://www.mysql.com/)** - Relational database
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Express](https://expressjs.com/)** - Web framework

---

## 🔄 Database Schema

```prisma
User
├── id, username, displayName, email
├── murmurs[]       → Posts by user
├── likes[]         → Murmurs liked by user
├── followers[]     → Users following this user
└── following[]     → Users this user follows

Murmur (Post)
├── id, content, userId, timestamps
├── user            → Author
└── likes[]         → Users who liked this

Follow
├── followerId, followingId
├── follower        → User who follows
└── following       → User being followed

MurmurLike
├── userId, murmurId
├── user            → User who liked
└── murmur          → Liked murmur
```

---

## 🎯 Example Response

```json
{
  "data": [
    {
      "id": "1",
      "content": "Just deployed my new app! 🚀",
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

---

## 🚧 Roadmap / Future Enhancements

- [ ] JWT Authentication (currently header-based)
- [ ] Input validation with class-validator
- [ ] Unit and E2E tests
- [ ] Rate limiting
- [ ] Redis caching
- [ ] Full-text search
- [ ] Media upload support
- [ ] Real-time notifications (WebSockets)
- [ ] Swagger/OpenAPI documentation
- [ ] Docker Compose setup

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the UNLICENSED License.

---

## 💬 Support

- 📖 Read the [documentation](./API_DOCUMENTATION.md)
- 🐛 Report bugs via GitHub issues
- 💡 Request features via GitHub issues

---

## 🙏 Acknowledgments

- **NestJS** team for the amazing framework
- **Prisma** team for the excellent ORM
- **Twitter** for the inspiration

---

<p align="center">
  Made with ❤️ using NestJS, Prisma, and MySQL
</p>
