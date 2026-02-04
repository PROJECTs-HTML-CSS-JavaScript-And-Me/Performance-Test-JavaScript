# CRUDTASK - Task Management Application.

<div align="center">
  <img src="img/Background.svg" alt="CRUDTASK Logo" width="120">
  <h3> CRUDZASO </h3>
  <p> A complete task management application with authentication and role-based access control. </p>
</div>

---

## Table of Contents.

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [User Accounts](#-user-accounts)
- [API Endpoints](#-api-endpoints)
- [Project Screenshots](#-project-screenshots)
- [License](#-license)

---

## Overview.

CRUDTASK is a full-featured task management application built with vanilla JavaScript, HTML, and CSS. It demonstrates proper CRUD (Create, Read, Update, Delete) operations with a RESTful API architecture using JSON Server as a mock backend.

---

## Features.

### Authentication System.
- **User Login/Register** - Secure authentication with email and password.
- **Session Management** - Uses sessionStorage for maintaining user sessions.
- **Role-Based Access Control** - Separate dashboards for Admin and User roles.
- **Route Protection** - Prevents unauthorized access to protected pages.

### Task Management.
- **Create Tasks** - Add new tasks with title, description, category, priority, and due date.
- **Read Tasks** - View all tasks in a responsive table with filtering.
- **Update Tasks** - Edit existing task details.
- **Delete Tasks** - Remove tasks with confirmation.

### Dashboard Features.
- **User Statistics** - View total, completed, and pending task counts.
- **Progress Tracking** - Visual progress indicator for task completion.
- **Priority Badges** - Color-coded priority indicators (High/Medium/Low).
- **Status Badges** - Visual status indicators (Pending/In Progress/Completed).
- **Search Functionality** - Real-time task search by title, description, or category.
- **Filter Tabs** - Filter tasks by status (All/Pending/Completed).

### UI/UX Features.
- **Responsive Design** - Works on desktop and mobile devices.
- **Bootstrap Integration** - Modern styling with Bootstrap 5.
- **Custom Icons** - Bootstrap Icons integration.
- **Loading States** - Visual feedback during API operations.
- **Alert System** - Toast notifications for success/error messages.

---

## Tech Stack.

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup structure |
| **CSS3** | Custom styling and responsive design |
| **JavaScript (ES6+)** | Application logic and API integration |
| **Bootstrap 5** | UI framework for responsive design |
| **Bootstrap Icons** | Icon library |
| **JSON Server** | Mock REST API backend |


## Getting Started.

### Prerequisites.

- **Node.js** (v14 or higher).
- **npm** (Node Package Manager).
- A modern web browser (Chrome, Firefox, Edge).

### Installation.

1. **Navigate to the project directory**
   ```bash
   cd "PT - CrudTask/json"
   ```

2. **Install JSON Server**
   ```bash
   npm install
   ```

3. **Start the API server**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Open the application**
   - Open `PT - CrudTask/index/index.html` in your web browser
   - Or use a local server (e.g., Live Server extension in VSCode)

### Alternative: Using the ZIP file.

If you have the compressed version:
```bash
unzip "PT - CrudTask.zip"
cd "PT - CrudTask/json"
npm install
npx json-server --watch db.json --port 3000
```

---

## User Accounts.

The application comes with pre-configured user accounts for testing:

| Email | Password | Role | Full Name |
|-------|----------|------|-----------|
| admin@crudzaso.com | admin123 | Admin | Alex Morgan |
| student@university.edu | student123 | User | Sarah Lin |
| juli@gmail.com | juli123 | User | Juliana |
| juad@gmail.com | 123456 | User | Juan |

### Role Differences.

**Admin Features:**
- Access to admin dashboard with additional management capabilities.
- Full view of all tasks across users.
- Extended statistics and monitoring.

**User Features:**
- Personal task dashboard.
- Manage only assigned tasks.
- Create, edit, and delete own tasks.

---

## API Endpoints.

The application uses JSON Server to provide RESTful API endpoints:

### Base URL.
```
http://localhost:3000
```

### Endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| PATCH | `/users/:id` | Partial user update |
| DELETE | `/users/:id` | Delete user |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get task by ID |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id` | Partial task update |
| DELETE | `/tasks/:id` | Delete task |


## Key Components.

### Authentication Flow.

1. User enters credentials on login page.
2. Application validates against `/users` endpoint.
3. On success, user session is stored in sessionStorage.
4. User is redirected based on role (admin/user).
5. Protected routes check for valid session.

### API Utility Module (`config.js`).

The application includes a comprehensive API utility with:
- **GET** - Fetch data from server.
- **POST** - Create new resources.
- **PUT** - Update entire resources.
- **PATCH** - Partial resource updates.
- **DELETE** - Remove resources.

### Session Management.

```javascript
// Save session
session.save(user);

// Get current session
session.get();

// Check if logged in
session.exists();

// Logout
session.destroy();

// Check role
session.isAdmin();
session.isUser();
```

---

## Task Data Structure.

```json
{
  "id": "1",
  "title": "Update Documentation",
  "category": "Documentation",
  "priority": "Medium",
  "status": "In Progress",
  "dueDate": "2023-10-24",
  "description": "Update project documentation with latest changes",
  "assigneeId": 2,
  "createdBy": 1
}
```

### Task Fields.
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier |
| `title` | String | Task title |
| `category` | String | Task category (Development, Documentation, etc.) |
| `priority` | String | Priority level (High/Medium/Low) |
| `status` | String | Current status |
| `dueDate` | Date | Task deadline |
| `description` | String | Detailed task description |
| `assigneeId` | Number | Assigned user ID |
| `createdBy` | Number | Creator user ID |

---

## User Data Structure.

```json
{
  "id": "1",
  "fullName": "Alex Morgan",
  "email": "admin@crudzaso.com",
  "password": "admin123",
  "role": "admin"
}
```

---

## Additional Resources.

- **Project Requirements**: See `Reference/Enunciado Prueba de Desempeño- M3 JavaScript.pdf`
- **JSON Server Documentation**: https://github.com/typicode/json-server
- **Bootstrap 5 Documentation**: https://getbootstrap.com/docs/5.3/

---

## Project Structure

```
PT - CrudTask/
├── 📄 README.md
├── 📁 css/
│   ├── dashboard.css      # Dashboard-specific styles
│   └── styles.css         # Global styles
├── 📁 img/
│   ├── Background.svg     # App logo/icon
│   ├── Border.png
│   ├── Profile Avatar.png
│   ├── Profile.png
│   └── SVG.svg
├── 📁 index/
│   ├── index.html         # Login page
│   ├── register.html      # Registration page
│   ├── dashboard.html     # User dashboard
│   ├── admin-dashboard.html # Admin dashboard
│   ├── create-task.html   # Create/edit task page
│   └── profile.html       # User profile page
├── 📁 js/
│   ├── auth.js            # Authentication logic
│   ├── config.js          # API configuration and utilities
│   ├── dashboard.js       # User dashboard logic
│   ├── admin-dashboard.js  # Admin dashboard logic
│   ├── create-task.js     # Task creation/editing logic
│   └── profile.js         # Profile management logic
├── 📁 json/
│   ├── db.json            # Database (users and tasks)
│   └── package.json       # Dependencies
└── 📁 Reference/
    ├── Enunciado Prueba de Desempeño- M3 JavaScript.pdf
    └── Imagen pegada*.png  # Reference screenshots
```

---

<div align="center">
  <p> CRUDTASK © 2023 </p>
</div>

