# WebDevProject-Backend

> This project is an e-commerce website built from scratch using the MERN stack (MongoDB, Express, React (still to be integrated), and Node.js). Our team of 5 dedicated students collaborated to develop a robust and user-friendly platform for online shopping. With a focus on delivering a seamless shopping experience, we incorporated various features and functionalities to meet the needs of both customers and administrators. We take pride in presenting this website, which emphasizes functionality while keeping design enhancements on the horizon.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)

## Project Overview

This repository contains the source code and files for an e-commerce website built using the MERN stack (MongoDB, Express, React (still to be integrated), and Node.js). The website provides a platform for users to browse and purchase products, with various functionalities implemented to enhance the overall shopping experience.

## Features

- User authentication: Users can create accounts, login, and manage their profiles.
- Product browsing: Users can view a list of available products, search for specific products, and apply filters to narrow down their search.
- Pagination: Product pages support pagination to improve navigation and loading times.
- Cart and wishlist: Users can add products to their cart or wishlist, remove items, and view detailed information about each product.
- Backend and frontend form validation: Form inputs are validated both on the frontend and backend to ensure data integrity and security.
- Dashboard: The dashboard provides administrative functionalities such as adding, editing, and removing products, as well as managing user roles.
- Account page: Users have access to an account page where they can view their account details, order history, and edit their information.
- Chatbot: Although currently not functional, a chatbot feature is planned for future development.
- Light and dark mode: The website supports both light and dark modes to accommodate user preferences.
- Session management: Sessions are implemented using the `express-sessions` package to provide a seamless browsing experience for users.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/WebDevProject-Backend.git`
2. Navigate to the project directory: `cd WebDevProject-Backend`
3. Install the dependencies: `npm install` / `npm i`

## Usage

1. Start the development server: `node bin/www` / `nodemon bin/www`
2. Open your web browser and visit `http://localhost:8080` to access the website.

Make sure to update the port in the URL accordingly if you're deploying the application to a different environment.

## Technologies

- MongoDB: NoSQL database used to store product and user data.
- Express: Web application framework for building the server-side of the application.
- Node.js: JavaScript runtime environment for executing server-side code.
- EJS: Templating engine used for rendering dynamic content.
- AJAX: Asynchronous JavaScript and XML for making asynchronous requests to the server.
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
- Express Sessions: Middleware for session management in Express applications.

## Contributing

Contributions to the project are welcome! If you find any issues or have suggestions for improvements, please feel free to open a new issue or submit a pull request.

To contribute to this project, follow these steps:

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.
