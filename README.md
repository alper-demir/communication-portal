# Communication Portal

## Project Overview

Communication Portal is a web-based messaging application developed using Node.js and EJS template engine. The project provides real-time communication features with user authentication, messaging, and interactive interfaces.

## Technologies Used

- **Backend**: 
  - Node.js
  - Express.js
  - Socket.IO (for real-time messaging)
  - Sequelize (ORM)
  - MySQL (Database)

- **Frontend**:
  - EJS Template Engine
  - Tailwind CSS
  - HTML/CSS

- **Authentication**:
  - Express-session
  - Bcrypt (Password hashing)

## Features

- User Registration and Authentication
- Real-time Messaging
- Private Chat Rooms
- User Profile Management
- Responsive Design

## Prerequisites

- Node.js (v14 or later)
- MySQL Database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alper-demir/communication-portal.git
   cd communication-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=communication_portal
   SESSION_SECRET=your_session_secret
   ```

4. Set up the database:
   - Create a MySQL database named `communication_portal`
   - The Sequelize ORM will handle table creation automatically

5. Start the application:
   ```bash
   npm start
   ```

## Development Scripts

- `npm start`: Start the server
- `npm run dev`: Start the server with nodemon for development
- `npm run build:css`: Compile Tailwind CSS

## Project Structure

- `app.js`: Main application entry point
- `config.js`: Configuration settings
- `models/`: Database models
- `routers/`: Express route definitions
- `views/`: EJS templates
- `public/`: Static assets (CSS, client-side JS)
- `middlewares/`: Custom Express middlewares

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open-source.

## Contact

Alper Demir - [GitHub Profile](https://github.com/alper-demir)

Project Link: [https://github.com/alper-demir/communication-portal](https://github.com/alper-demir/communication-portal)
