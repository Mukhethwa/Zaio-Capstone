Airbnb Full-Stack Clone and Admin Dashboard
===========================================

A full-stack web application replicating core functionalities of Airbnb, including a public-facing customer portal, a protected administrative dashboard for hosts, and a secure REST API. The platform supports accommodation discovery, dynamic cost calculations, booking management, and secure user sessions via token-based authentication.

Table of Contents
-----------------

*   [Project Overview](https://www.google.com/search?q=#project-overview)
    
*   [Key Features](https://www.google.com/search?q=#key-features)
    
*   [Technical Stack](https://www.google.com/search?q=#technical-stack)
    
*   [Project Structure](https://www.google.com/search?q=#project-structure)
    
*   [Environment Variables](https://www.google.com/search?q=#environment-variables)
    
*   [Getting Started](https://www.google.com/search?q=#getting-started)
    
*   [API Endpoints](https://www.google.com/search?q=#api-endpoints)
    
*   [Deployment](https://www.google.com/search?q=#deployment)
    

Project Overview
----------------

This project consists of three integrated core layers:

1.  **Frontend Client**: A React application mirroring Airbnb’s user experience across a Home Page, a filtered Location Search page, and a detailed Location View equipped with an interactive reservation cost calculator.
    
2.  **Admin Dashboard**: An authenticated management view built into the frontend allowing authorized hosts to perform complete CRUD operations on property listings and monitor customer reservations.
    
3.  **Backend API**: An Express/Node.js server connected to a MongoDB database utilizing Mongoose schemas to safely process business logic, enforce data validation, and issue JSON Web Tokens for identity verification.
    

Key Features
------------

### Frontend Client

*   **Home Page**: Features a hero banner, custom photographic destination cards under "Inspiration for your next trip", a promotional layout for Experiences, an Airbnb gift card section, and a four-column pre-footer directory.
    
*   **Location Filter View**: Displays dynamic search listings containing comprehensive metadata, pricing parameters, star ratings, and side-by-side comparative layouts.
    
*   **Location Details Page**: Implements a five-image asymmetric grid gallery, structured house rules/policies, and a dynamic cost calculator tracking price per night, weekly discounts, cleaning fees, and occupancy taxes based on custom dates and guest caps.
    

### Admin Dashboard

*   **Session-Protected Routing**: Utilizes explicit JWT validation to guard administrative pathways from unauthenticated clients.
    
*   **Property CRUD Interface**: Includes responsive intake forms with field validation mapping deep data values (e.g., specific sub-ratings, baseline amenities, localized accommodation pricing structures).
    
*   **Listing Media Control**: Supports operational file configurations for uploading and rendering localized thumbnail asset paths.
    

### Backend API

*   **Token Middleware Enforcements**: Restricts state-altering endpoints to valid bearer tokens via reusable verification layers.
    
*   **Relational Data Mapping**: Links reservations securely across registered user and host models inside MongoDB.
    

Technical Stack
---------------

*   **Frontend Client & Dashboard**: React.js, Tailwind CSS / Vanilla CSS, React Router DOM, Axios
    
*   **Backend Server**: Node.js, Express.js
    
*   **Database Architecture**: MongoDB, Mongoose ODM
    
*   **Authentication**: JSON Web Tokens (JWT), Browser Context State Storage
    
*   **Media Uploads**: Multer Middleware
    

Project Structure
-----------------

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ├── backend/  │   ├── controllers/  │   │   ├── accommodationController.js  │   │   ├── reservationController.js  │   │   └── userController.js  │   ├── models/  │   │   ├── Accommodation.js  │   │   ├── Reservation.js  │   │   └── User.js  │   ├── routes/  │   │   ├── accommodationRoutes.js  │   │   ├── reservationRoutes.js  │   │   └── userRoutes.js  │   ├── middleware/  │   │   └── auth.js  │   └── server.js  ├── frontend/  │   ├── public/  │   ├── src/  │   │   ├── components/  │   │   │   ├── Header.jsx  │   │   │   └── Footer.jsx  │   │   ├── pages/  │   │   │   ├── Home.jsx  │   │   │   ├── LocationPage.jsx  │   │   │   ├── LocationDetails.jsx  │   │   │   ├── Login.jsx  │   │   │   └── AdminDashboard.jsx  │   │   ├── App.jsx  │   │   └── main.jsx  ├── Procfile  ├── package.json  └── README.md   `

Environment Variables
---------------------

Create a configuration .env file in the root backend folder to expose operational secrets securely:

Code snippet

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PORT=5000  MONGO_URI=mongodb+srv://:@cluster.mongodb.net/airbnb_clone?retryWrites=true&w=majority  JWT_SECRET=your_jwt_signing_key_secret   `

Getting Started
---------------

### Prerequisites

*   Node.js installed locally
    
*   A running MongoDB Atlas instance or a local MongoDB community server daemon
    

### Local Setup Instructions

1.  Bashgit clone \[your-repository-url\]cd \[your-project-folder\]
    
2.  Bashcd backendnpm install# Create your .env file and fill out the keysnode server.js
    
3.  Bashcd frontendnpm installnpm start
    

API Endpoints
-------------

### Accommodation Management

*   POST /api/accommodations - Generates a new property listing (Protected)
    
*   GET /api/accommodations - Retrieves all active property listings (Public)
    
*   DELETE /api/accommodations/:id - Purges an explicit property listing by ID (Protected)
    

### User Authentication

*   POST /api/users/login - Validates host/user credentials and returns a signed JWT
    

### Reservation Tracking

*   POST /api/reservations - Registers a verified trip stay booking into the database
    
*   GET /api/reservations/host - Extracts incoming customer bookings registered against listings owned by the host (Protected)
    
*   GET /api/reservations/user - Fetches the personal itinerary log of the authenticated client user (Protected)
    
*   DELETE /api/reservations/:id - Drop or cancel an existing stay booking by ID (Protected)
    

Deployment
----------

### Heroku Cloud Platform

This workspace contains a root-level Procfile configured for automated platform provisioning:

1.  Bashheroku loginheroku create your-airbnb-app-name
    
2.  Inject your production cloud secrets directly into your environment dashboard via Settings > Config Vars:
    
    *   MONGO\_URI
        
    *   JWT\_SECRET
        
3.  Bashgit push heroku main
    
4.  Update the MongoDB Atlas Network Access whitelist to allow traffic from 0.0.0.0/0 to handle dynamic Heroku routing requests cleanly.
