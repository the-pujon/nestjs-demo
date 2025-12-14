# Murmur API - Test Collection

## Setup
Base URL: `http://localhost:3000`
User ID Header: `x-user-id: 1` (use IDs from seed data)

---

## 🧪 Test Sequence

### 1. Get Current User Info
```http
GET /api/me HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 200 OK with user details and follower counts

---

### 2. Get User by Username
```http
GET /api/users/alice HTTP/1.1
Host: localhost:3000
```

Expected: 200 OK with Alice's profile

---

### 3. Create a Murmur
```http
POST /api/me/murmurs HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-user-id: 1

{
  "content": "This is my first test murmur!"
}
```

Expected: 201 Created with murmur details
**Save the murmur ID for next tests**

---

### 4. Get Timeline (Empty or Minimal)
```http
GET /api/murmurs?page=1&limit=10 HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 200 OK with paginated murmurs (only own murmurs if not following anyone)

---

### 5. Follow a User
```http
POST /api/users/2/follow HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 204 No Content
Now user 2's murmurs will appear in timeline

---

### 6. Get Timeline Again (Should Have More)
```http
GET /api/murmurs?page=1&limit=10 HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 200 OK with own murmurs + followed user's murmurs

---

### 7. Get Single Murmur
```http
GET /api/murmurs/1 HTTP/1.1
Host: localhost:3000
```

Expected: 200 OK with murmur details

---

### 8. Like a Murmur
```http
POST /api/murmurs/1/like HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 204 No Content

---

### 9. Verify Like (Check Timeline)
```http
GET /api/murmurs HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 200 OK, murmur should have `likedByMe: true` and `likeCount` increased

---

### 10. Update Own Murmur
```http
PATCH /api/me/murmurs/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-user-id: 1

{
  "content": "Updated content for my murmur"
}
```

Expected: 200 OK with updated murmur

---

### 11. Unlike a Murmur
```http
DELETE /api/murmurs/1/like HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 204 No Content

---

### 12. Unfollow User
```http
DELETE /api/users/2/follow HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 204 No Content

---

### 13. Delete Own Murmur
```http
DELETE /api/me/murmurs/1 HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 204 No Content

---

## ❌ Error Test Cases

### Try to Edit Someone Else's Murmur
```http
PATCH /api/me/murmurs/2 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-user-id: 1

{
  "content": "Trying to edit"
}
```

Expected: 403 Forbidden

---

### Try to Like Same Murmur Twice
```http
POST /api/murmurs/1/like HTTP/1.1
Host: localhost:3000
x-user-id: 1
```
(Run twice)

Expected: First 204, Second 409 Conflict

---

### Try to Follow Same User Twice
```http
POST /api/users/2/follow HTTP/1.1
Host: localhost:3000
x-user-id: 1
```
(Run twice)

Expected: First 204, Second 409 Conflict

---

### Try to Follow Yourself
```http
POST /api/users/1/follow HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

Expected: 409 Conflict

---

### Try to Create Murmur Over 280 Characters
```http
POST /api/me/murmurs HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-user-id: 1

{
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}
```

Expected: 409 Conflict

---

### Access Without Authentication
```http
GET /api/murmurs HTTP/1.1
Host: localhost:3000
```

Expected: 401 Unauthorized

---

## 📊 Pagination Tests

### First Page
```http
GET /api/murmurs?page=1&limit=5 HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

### Second Page
```http
GET /api/murmurs?page=2&limit=5 HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

### Custom Limit
```http
GET /api/murmurs?page=1&limit=20 HTTP/1.1
Host: localhost:3000
x-user-id: 1
```

---

## 🔥 Complete cURL Commands

```bash
# 1. Get current user
curl -H "x-user-id: 1" http://localhost:3000/api/me

# 2. Get user by username
curl http://localhost:3000/api/users/alice

# 3. Create murmur
curl -X POST -H "x-user-id: 1" -H "Content-Type: application/json" \
  -d '{"content":"Test murmur from cURL"}' \
  http://localhost:3000/api/me/murmurs

# 4. Get timeline
curl -H "x-user-id: 1" "http://localhost:3000/api/murmurs?page=1&limit=10"

# 5. Follow user
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/users/2/follow

# 6. Like murmur
curl -X POST -H "x-user-id: 1" http://localhost:3000/api/murmurs/1/like

# 7. Update murmur
curl -X PATCH -H "x-user-id: 1" -H "Content-Type: application/json" \
  -d '{"content":"Updated content"}' \
  http://localhost:3000/api/me/murmurs/1

# 8. Unlike murmur
curl -X DELETE -H "x-user-id: 1" http://localhost:3000/api/murmurs/1/like

# 9. Unfollow user
curl -X DELETE -H "x-user-id: 1" http://localhost:3000/api/users/2/follow

# 10. Delete murmur
curl -X DELETE -H "x-user-id: 1" http://localhost:3000/api/me/murmurs/1
```

---

## 💡 Testing Tips

1. **Start with seed data**: Run `npm run seed` to populate database
2. **Use different user IDs**: Test with multiple users to see follow/timeline behavior
3. **Check response codes**: Ensure correct HTTP status codes
4. **Verify data persistence**: Check that changes persist in database
5. **Test pagination**: Create many murmurs and test different page/limit combinations
6. **Test error cases**: Verify proper error messages and status codes
7. **Use Prisma Studio**: Visual verification at `npm run prisma:studio`

---

## 🎯 Success Criteria

✅ Can create, read, update, delete murmurs
✅ Can follow/unfollow users
✅ Can like/unlike murmurs
✅ Timeline shows only relevant murmurs
✅ Pagination works correctly
✅ Error handling works as expected
✅ Cannot edit/delete others' content
✅ Cannot duplicate likes/follows
✅ All endpoints return correct status codes
