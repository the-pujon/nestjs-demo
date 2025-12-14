# 🚀 Quick Start Guide - Murmur API

## Step 1: Prerequisites Check

Make sure you have:
- ✅ Node.js v18+ installed
- ✅ MySQL running (via Docker or local installation)
- ✅ npm or yarn

## Step 2: Database Setup

### Option A: Using Docker (Recommended)

```bash
# Navigate to the db directory
cd ../db

# Start MySQL with Docker Compose
docker-compose up -d

# Check if MySQL is running
docker ps
```

### Option B: Using Local MySQL

Make sure your MySQL server is running on port 3306.

## Step 3: Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the database credentials:
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=test
   DATABASE_URL="mysql://root:your_password@localhost:3306/test"
   PORT=3000
   ```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Database Migration

Run Prisma migrations to create the database schema:

```bash
npm run prisma:migrate
```

This will:
- Create all necessary tables (User, Murmur, Follow, MurmurLike)
- Set up relationships and indexes

## Step 6: Seed the Database (Optional)

Populate the database with sample data for testing:

```bash
npm run seed
```

This creates:
- 4 test users (Alice, Bob, Charlie, Diana)
- Sample murmurs
- Follow relationships
- Likes

**Note the User IDs from the output - you'll need them for testing!**

## Step 7: Start the Application

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000`

## Step 8: Test the API

### Using cURL

```bash
# Get current user info (replace 1 with your user ID)
curl -H "x-user-id: 1" http://localhost:3000/api/me

# Get timeline
curl -H "x-user-id: 1" http://localhost:3000/api/murmurs

# Create a murmur
curl -X POST \
  -H "x-user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{"content":"My first murmur!"}' \
  http://localhost:3000/api/me/murmurs

# Follow a user (replace 2 with target user ID)
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/users/2/follow

# Like a murmur (replace 1 with murmur ID)
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/murmurs/1/like
```

### Using Postman or Thunder Client

1. **Get Timeline**
   - Method: GET
   - URL: `http://localhost:3000/api/murmurs?page=1&limit=10`
   - Headers: `x-user-id: 1`

2. **Create Murmur**
   - Method: POST
   - URL: `http://localhost:3000/api/me/murmurs`
   - Headers: `x-user-id: 1`, `Content-Type: application/json`
   - Body:
     ```json
     {
       "content": "Hello world!"
     }
     ```

3. **Follow User**
   - Method: POST
   - URL: `http://localhost:3000/api/users/2/follow`
   - Headers: `x-user-id: 1`

## 📝 All Available Endpoints

### Murmurs
- `GET /api/murmurs?page=1&limit=10` - Get timeline
- `GET /api/murmurs/:id` - Get single murmur
- `POST /api/me/murmurs` - Create murmur
- `PATCH /api/me/murmurs/:id` - Update own murmur
- `DELETE /api/me/murmurs/:id` - Delete own murmur

### Likes
- `POST /api/murmurs/:id/like` - Like a murmur
- `DELETE /api/murmurs/:id/like` - Unlike a murmur

### Follow/Unfollow
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

### Users
- `GET /api/me` - Get current user
- `GET /api/users/:username` - Get user by username

## 🔧 Useful Commands

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run Prisma Studio (Database GUI)
npm run prisma:studio

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Re-seed database
npm run seed
```

## 🐛 Troubleshooting

### Connection Error
If you get a connection error:
1. Check MySQL is running: `docker ps` or check local MySQL service
2. Verify credentials in `.env` file
3. Test connection: `mysql -u root -p -h localhost`

### Migration Error
If migrations fail:
```bash
# Reset database (⚠️ This deletes all data!)
npx prisma migrate reset --force

# Then run migrations again
npm run prisma:migrate
```

### Port Already in Use
If port 3000 is busy:
1. Change `PORT` in `.env` file
2. Or kill the process using port 3000

### TypeScript Errors
If you see TypeScript errors:
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Restart the dev server
npm run start:dev
```

## 📚 Next Steps

1. Read the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs
2. Explore the code in `src/` directory
3. Check out Prisma Studio: `npm run prisma:studio`
4. Implement JWT authentication (currently using simple header-based auth)
5. Add input validation with class-validator
6. Write tests

## 💡 Tips

- **User IDs**: Use the User IDs from the seed output for testing
- **Timeline**: You'll only see murmurs from users you follow (plus your own)
- **Pagination**: Adjust `page` and `limit` query parameters
- **Prisma Studio**: Great for visualizing and editing database records

## 🎯 Example Workflow

1. Start as Alice (user ID 1)
   ```bash
   curl -H "x-user-id: 1" http://localhost:3000/api/me
   ```

2. Create a murmur
   ```bash
   curl -X POST -H "x-user-id: 1" -H "Content-Type: application/json" \
     -d '{"content":"Testing the API!"}' \
     http://localhost:3000/api/me/murmurs
   ```

3. Follow Bob (user ID 2)
   ```bash
   curl -X POST -H "x-user-id: 1" http://localhost:3000/api/users/2/follow
   ```

4. View timeline (now includes Bob's murmurs)
   ```bash
   curl -H "x-user-id: 1" http://localhost:3000/api/murmurs
   ```

5. Like Bob's murmur
   ```bash
   curl -X POST -H "x-user-id: 1" http://localhost:3000/api/murmurs/2/like
   ```

Happy coding! 🚀
