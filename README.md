

# X Clone

This is a clone of X, a social media platform, built using the MERN stack (MongoDB, Express, React, Node.js) with DaisyUI for the frontend styling. The application provides a basic set of features similar to the X platform, including user authentication, posting updates, and following other users.

## Table of Contents

- [Features](#features) 
- [Installation](#Steps)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (sign up, login, logout)
- Create, read, update, and delete posts
- Follow and unfollow users
- Responsive UI built with DaisyUI



### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/x-clone.git
   cd x-clone

2. Install dependencies for both backend and frontend:


```sh
npm install
npm install --prefix frontend

```
3. Create a .env file in the root directory and add the necessary environment variables (see Environment Variables).
```sh
PORT=
MONGO_URI=
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```
### Accessing the Application
The X Clone application is deployed and can be accessed at the following URL:

https://x-clone-hg.onrender.com/

### Running the Application Locally

1.Start the backend
```sh
npm run dev
```
2.Start the frontend
```sh
cd frontend
npm run dev
```
3.Go to localhost:
http://localhost:3000

## Technologies Used
#### Frontend:
- React
- DaisyUI
- React Router
- React Hot Toast
#### Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads
- Development Tools:
- Nodemon
- Dotenv

## Contributing
Contributions are welcome! Please follow these steps:

- Fork the repository.
- Create a new branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -m 'Add some feature').
- Push to the branch (git push origin feature/your-feature).
- Open a Pull Request.
