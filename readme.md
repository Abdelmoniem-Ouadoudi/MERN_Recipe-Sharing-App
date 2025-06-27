# 🍳 Modern Recipe Hub

A beautiful, modern recipe sharing platform built with the MERN stack. Share your favorite recipes, discover new dishes, and connect with fellow food enthusiasts!

![Recipe Hub Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Responsive](https://img.shields.io/badge/Design-Responsive-orange)
![Dark Mode](https://img.shields.io/badge/Theme-Dark%2FLight-purple)

## ✨ Features

### 🎨 **Modern UI/UX Design**
- Beautiful, responsive design that works on all devices
- Dark/Light theme toggle with system preference detection
- Glassmorphism effects and smooth animations
- Professional color palette and typography

### 🔐 **Authentication System**
- User registration and login
- Secure JWT token authentication
- Password reset functionality
- Protected routes and middleware

### 🍽️ **Recipe Management**
- Add, edit, and delete recipes
- Image upload support
- Ingredients and instructions management
- Search and filter recipes
- Save recipes to favorites

### 📱 **Responsive Experience**
- Mobile-first design approach
- Touch-friendly interface
- Hamburger navigation for mobile
- Optimized for all screen sizes

## 🚀 Tech Stack

### **Frontend**
- **React.js** - Modern JavaScript library
- **React Router** - Client-side routing
- **CSS3** - Custom properties and modern styling
- **React Toastify** - Beautiful notifications

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### **Authentication & Security**
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- [Live Demo](#live-demo)

## Features

1. **User Authentication**: Secure user authentication and registration system.
2. **Recipe Management**: Create, edit, and delete your recipes.
3. **Recipe Discovery**: Browse and search for recipes shared by other users.
4. **Comments and Ratings**: Leave comments and rate recipes.
5. **Favorite Recipes**: Save your favorite recipes for easy access.
6. **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Prerequisites

- [Node.js](https://nodejs.org/) installed (v14 or higher).
- [MongoDB](https://www.mongodb.com/) installed and running locally or on a remote server.
- [Git](https://git-scm.com/) for version control.
- A text editor or integrated development environment (IDE) of your choice (e.g., Visual Studio Code).

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Rohith-Manjunath/MERN-Recipe-App.git

2. Navigate to the project directory:

       cd Mern-Recipe-App   

3. Navigate to the client directory:
     
       cd client 
       cd my-app 

4. Install client dependencies:

       npm install 

5. Return to the project root:

       cd ..
       cd ..

6. Navigate to server folder:

       cd server

7. Create a `.env` file in the project root and configure your environment variables:
   
       PORT=2000
       MONGODB_URI=mongodb://localhost/recipe-app
       SECRET=your-secret-key

Replace `your-secret-key` with a secure secret for JWT token generation.

8. Start the development server

       node index.js


## Folder Structure
The project follows a standard MERN stack folder structure:

- client: Contains the React frontend application.
- server: Contains the Express.js backend application.
- Schema: Define the MongoDB schemas and models.
- routes: Define the API routes.
- controllers: Handle route logic and interact with the database.
- middlewares: Custom middleware functions.
- db: Configuration files (e.g., database connection).

## Technologies Used
#### Frontend:

- React

#### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for authentication
- bcrypt for secured password hashing


## Live Demo

Check out the live demo of the Recipe Sharing Full Stack App [here](https://benevolent-donut-65e579.netlify.app).

