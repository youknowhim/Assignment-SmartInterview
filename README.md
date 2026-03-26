🚀 Task Management Dashboard (MERN Stack)

A full-featured Task Management Dashboard built using the MERN stack (MongoDB, Express, React, Node.js).<br>
It includes authentication, task CRUD operations, filtering, sorting, pagination, analytics, dark mode, and optimized UX features.

---

Deployed Link - https://assignment-smart-interview-pt97.vercel.app/
login credentials for checking all functionalities 
email-pallavrai23@gmail.com
password-Pallav@123

📌 Features

🔐 Authentication

- User Registration & Login<br>
- JWT-based authentication<br>
- Protected routes (only logged-in users can access dashboard)<br>

📋 Task Management

- Create, Edit, Delete tasks<br>
- Mark tasks as completed<br>
- Each task is user-specific (multi-user support)<br>

🔍 Search & Filtering

- Search tasks by title (debounced)<br>
- Filter by:
  - Status (Todo, In Progress, Completed)<br>
  - Priority (Low, Medium, High)<br>

⚡ Performance Features

- Debounced search (3 seconds delay)<br>
- Server-side pagination<br>
- Optimized queries with MongoDB<br>

📊 Sorting

- Sort by:
  - Created Date<br>
  - Due Date<br>
  - Priority (custom logic)<br>

📈 Analytics Dashboard

- Total tasks<br>
- Completed tasks<br>
- Pending tasks<br>
- Completion rate (%)<br>

🎨 UI/UX

- Dark mode toggle 🌙<br>
- Responsive design<br>
- Loader spinner for API calls<br>
- Smooth interactions<br>

---

🏗️ Tech Stack

Frontend

- React.js<br>
- React Router<br>
- CSS (custom styling)<br>

Backend

- Node.js<br>
- Express.js<br>
- MongoDB (Mongoose)<br>
- JWT Authentication<br>

---

⚙️ Project Structure

/frontend
  /src
    /pages
    /styles
    /routes

/backend
  /controllers
  /models
  /routes
  /middleware

---

🔧 Backend Setup

1️⃣ Navigate to backend

cd backend

2️⃣ Install dependencies

npm install

3️⃣ Create ".env" file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run server

node server.js

👉 Server runs on:

http://localhost:5000

---

💻 Frontend Setup

1️⃣ Navigate to frontend

cd frontend

2️⃣ Install dependencies

npm install

3️⃣ Run frontend

npm run dev

👉 Runs on:

http://localhost:5173

---

🗄️ Database (MongoDB)

Collections:

- Users<br>
- Tasks<br>

Task Schema:

{
  title: String,
  description: String,
  status: ["Todo", "In Progress", "Completed"],
  priority: ["Low", "Medium", "High"],
  dueDate: Date,
  user: ObjectId,
  createdAt: Date
}

---

🔗 API Endpoints

🔐 Auth Routes

Register

POST /api/auth/register

Login

POST /api/auth/login

---

📋 Task Routes

Get Tasks (with filters & pagination)

GET /api/tasks

Query Params:

search
status
priority
page
limit
sortBy
order

---

Create Task

POST /api/tasks

---

Update Task

PUT /api/tasks/:id

---

Delete Task

DELETE /api/tasks/:id

---

Analytics

GET /api/tasks/analytics

---

🧠 Key Functionalities Explained

---

🔍 Debouncing

- Implemented using "setTimeout" in React<br>
- Prevents API calls on every keystroke<br>
- Only triggers after 3 seconds of inactivity<br>

---

📄 Pagination

- Implemented on backend using:

skip = (page - 1) * limit

- Improves performance for large datasets<br>

---

🔎 Searching

- Uses MongoDB regex:

{ title: { $regex: search, $options: "i" } }

- Case-insensitive search<br>

---

📊 Sorting

Backend Sorting

.sort({ field: 1 or -1 })

Custom Priority Sorting (Frontend)

High → Medium → Low

Handled using:

{ High: 3, Medium: 2, Low: 1 }

---

⏳ Loader

- Displays spinner during API calls<br>
- Improves UX and feedback<br>

---

🌙 Dark Mode

- Controlled via state + localStorage<br>
- Persists user preference<br>

---

🧠 Design Decisions

✅ Backend Pagination

- Reduces data transfer<br>
- Scales well with large datasets<br>

✅ Debounced Search

- Prevents excessive API calls<br>
- Improves performance<br>

✅ JWT Authentication

- Stateless authentication<br>
- Secure route handling<br>

✅ Separation of Concerns

- Controllers handle logic<br>
- Routes handle endpoints<br>
- Middleware handles auth<br>

---

🚀 Future Improvements

- Add notifications (toast UI)<br>
- Add charts (analytics visualization)<br>
- Add drag-and-drop tasks<br>
- Add role-based access (admin/user)<br>

---

👨‍💻 Author

Pallav Rai<br>

---

⭐ Conclusion

This project demonstrates:

- Full-stack development<br>
- API design<br>
- Performance optimization<br>
- Clean UI/UX practices<br>
