# Blooger REST API

## Project Description

The Blog REST API is a powerful and flexible backend service designed to support a full-fledged blogging platform.
This API allows users to create, read, update, and delete blog posts while providing user authentication and authorization features.
Built using Node.js and Express, the API is structured to be efficient and easy to integrate with front-end applications. 
Additionally, the API integrates with **Google Generative AI**  for dynamic content generation.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Google Generative AI Integratio](#Google-Generative-AI-Integratio)
- [User Authentication](#user-authentication)

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Web framework for building the RESTful API.
- **MongoDB**: NoSQL database for storing blog posts and user information.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Bcrypt.js**: For password hashing.
- **AWS S3**: For image storage.
- **Mongoose**: For MongoDB object modeling.
- **Google Generative AI**: For generating dynamic blog content.

## Features

- User registration and login
- Create, read, update, and delete blog posts
- User-specific blog posts management
- Comments section for each blog post
- Integration with Google Generative AI for blog content generation
- Responsive and user-friendly API design
- Secure user authentication and authorization

## API Endpoints

### Authentication

- **POST** `users/register`: Register a new user
- **POST** `users/login`: Log in an existing user

### Blog Posts

- **POST** `/api/blogs`: Create a new blog post
- **POST** `/api/blogs/generate-blog`: Generative AI for dynamic Blog content.
- **GET** `/api/blogs`: Retrieve all blog posts
- **GET** `/api/blogs/:id`: Retrieve a specific blog post by ID
- **PUT** `/api/blogs/:id`: Update a specific blog post by ID
- **DELETE** `/api/blogs/:id`: Delete a specific blog post by ID


## Google Generative AI Integration

The Blog REST API integrates with the **Google Generative AI** model (`gemini-1.5-flash`) to generate dynamic blog content. 
Users can request blog posts on various topics, and the API will utilize the generative AI model to create relevant and informative articles, enhancing the blogging experience. 
This feature allows for rapid content generation and can assist users in producing high-quality posts with minimal effort.

## User Authentication

The API utilizes JWT for secure user authentication. Upon successful login, a token is generated and returned to the user.
This token must be included in the headers of protected routes to access user-specific resources.

