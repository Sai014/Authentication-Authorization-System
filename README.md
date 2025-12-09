# 🔐 Authentication & Authorization System  
A full-stack ready backend authentication system built using **Node.js**, **Express**, **MongoDB**, **JWT**, and **bcrypt**, featuring secure user signup/login, password hashing, protected routes, and role-based access control.

---

## 🚀 Features

### ✅ User Authentication
- User **signup** with encrypted passwords using bcrypt  
- User **login** with JWT token generation  
- Token-based session management  

### ✅ Authorization  
- **Middleware-protected routes**  
- **Role-based access control** (user/admin)  
- Sample admin-only endpoint  

### ✅ Security Enhancements  
- **CORS** enabled  
- **Helmet** for HTTP header protection  
- **Rate limiting** to prevent brute-force attacks  
- Environment variables using **dotenv**

### ✅ Clean Architecture  
Structured into:
/config → Database connection
/controllers → Business logic
/middleware → Auth & role checks
/models → MongoDB schemas
/routes → API routing
server.js → App entry point


---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|----------|
| **Node.js** | Runtime environment |
| **Express.js** | Server framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Helmet** | Security middleware |
| **express-rate-limit** | Prevent DDoS/brute force |
| **dotenv** | Environment variable handling |

---

## 📦 Installation & Setup

```sh
git clone https://github.com/<your-username>/Authentication-Authorization-System.git
cd Authentication-Authorization-System
npm install
mongod
node server.js
```

