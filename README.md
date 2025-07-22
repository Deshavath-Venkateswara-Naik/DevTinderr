# 💘 DevTinder – Match Developers with Skills & Collaboration

DevTinder is a full-stack web application that connects developers based on their skills, interests, and project goals. Whether you're looking for a coding partner, collaborator, or tech co-founder, DevTinder helps you find the perfect match.

---

## 🚀 Features

### 🧑‍💼 User Authentication
- Secure Sign Up / Login with JWT
- Password encryption using bcrypt
- Session management

### 👤 Developer Profiles
- Create and edit your profile
- Add bio, skills, GitHub, LinkedIn, and portfolio links
- Upload resume (PDF)

### 🤝 Matchmaking
- Intelligent matching based on skills, interests, and experience
- Browse profiles with filters and search options

### 💬 Real-time Chat
- One-to-one messaging using Socket.IO
- Online/offline indicators
- Typing status and message seen features

### 💸 Razorpay Payment Integration
- Unlock premium features
  - View/download locked resumes
  - Boost profile visibility
- Secure transaction logs and status

### 📱 Responsive UI
- Works on desktops, tablets, and mobile phones
- Sleek design using React Bootstrap / TailwindCSS

---

## 🛠 Tech Stack

### 🌐 Frontend
- React.js
- React Router
- Axios
- TailwindCSS / Bootstrap
- Razorpay JS SDK

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt Password Hashing
- Socket.IO for chat
- Razorpay Node SDK

---

## 🗃 Database Models (MongoDB)

- `User`: name, email, password, skills, bio, social links, resume URL, role
- `Chat`: participants, messages, timestamps
- `Payment`: userId, amount, status, paymentId, receiptId

---

## 📦 Project Structure

