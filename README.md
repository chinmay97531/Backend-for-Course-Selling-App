# Course Selling App - Backend

This is the backend repository for the Course Selling App, built using Node.js, Express, and MongoDB.

## Features
- User authentication (JWT-based)
- Admin and user roles
- Course creation and management
- Secure API endpoints

## Installation

### 1. Clone the repository
```sh
git clone https://github.com/your-username/course-selling-backend.git
cd course-selling-backend
```

### 2. Install dependencies
```sh
npm install
npm install mongoose express jsonwebtoken zod bcrypt
```

### 3. Set up environment variables
Create a `.env` file in the root directory and add the following variables:
```env
MONGO_DB_URL=your_mongodb_connection_string
```

### 4. Set up config.js
Create a `config.js` file in the root directory and add the following variables:
```env
const JWT_User_SECRET = <your JWT user key>;
const JWT_Admin_SECRET = <your JWT admin key>;

module.exports = {
    JWT_User_SECRET,
    JWT_Admin_SECRET
}
```

### 5. Run the server
```sh
npm start
```

## API Endpoints

### Users
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/courses/:id` - Get all courses

### Admin
- `POST /api/v1/admin/signup` - Admin registration
- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/courses/:id` - Create a new course
- `PUT /api/v1/courses/:id` - Update a course
- `GET /api/v1/courses/:id` - Get all courses

### Course
- `GET /api/v1/purchase/:id` - User purchase the course
- `PUT /api/v1/preview/:id` - See all the courses

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- dotenv for environment variables

## Contributing
Feel free to contribute by creating issues or submitting pull requests.

