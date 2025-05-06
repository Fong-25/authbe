# Authentication Backend

A secure and robust authentication backend built with Node.js, Express, and MongoDB. This project provides a complete authentication system with features like user registration, login, and JWT-based authentication.

## Features

- User registration and login
- JWT (JSON Web Token) based authentication
- Password hashing using bcrypt
- MongoDB database integration
- CORS enabled
- Cookie-based session management
- Environment variable configuration
- RESTful API architecture

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Fong-25/authbe.git
cd authbackend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Project Structure

```
authbackend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── server.js       # Application entry point
└── package.json    # Project dependencies
```

## API Endpoints

### Current Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET api/auth/users` - Get all users - Admin only
- `GET api/auth/user/:id` - Get user with Mongo id (._id) - Admin only

## Dependencies

- express: Web framework
- mongoose: MongoDB object modeling
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- cookie-parser: Cookie parsing middleware
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variable management

## Running the Application

1. Start the development server:
```bash
node server.js
```

The server will start running on the specified port (default: 3000).

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- CORS configuration
- Environment variable protection
- Cookie-based session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 