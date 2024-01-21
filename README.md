# Event-Management-System

## Description

    This is an Event Management System designed to streamline the process of creating, managing, and participating in events. The system enables users to create events, register for events, and view event details along with a list of registered participants.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Prisma](#prisma)
- [API Documentation](#api-documentation)
  - [Event Management Endpoints](#event-management-endpoints-eventjs)
  - [Participant Management Endpoints](#participant-management-endpoints-participantjs)
- [License](#license)

# Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/Ibadetegashi/Event-Management-System.git

2. Install dependencies:
   npm install

# Configuration
1. Create a .env file in the project root.
2. Add the following configurations to the .env file:
- DATABASE_URL="": Connection URL for the MySQL database.
- EMAIL="": Email address used for sending emails.
- PASSWORD="": Password associated with the email address (please handle securely). Use a Unique App-Specific Password. Instead of using your primary email account password, generate a unique app-specific password specifically for sending emails through this application.
- PORT="": Port number on which the application will run.
 ### with cloudinary (https://cloudinary.com/)
- CLOUDINARY_CLOUD_NAME=""  : Cloudinary Cloud Name
- CLOUDINARY_API_KEY=""    :Cloudinary API Key
- CLOUDINARY_API_SECRET=""   : Cloudinary API Secret
### without cloudinary
If you prefer not to use Cloudinary and want to use local file upload, follow these steps:

1. Open middlewares/upload.js and replace with uploads/Upload.txt
2. Open controllers/event.js and replace with uploads/event.txt


## Prisma 
1. DATABASE_URL="mysql://username:password@localhost:3306/database_name"
Replace username, password, localhost, 3306, and database_name with your actual database credentials and configuration.
2. Apply Migrations:
npx prisma migrate dev
This command will execute the migrations defined in the prisma/migrations folder. It sets up the database schema based on the changes specified in each migration file.
3. Generate Prisma Client:
npx prisma generate
This command generates the Prisma Client based on the schema.prisma file.


# Usage
To start the application, run:
- npm start
- Access the application at http://localhost:PORT, where PORT is specified in server.js.
 
 
# API Documentation

## Event Management Endpoints (`event.js`):

- <span style="color:green;">**POST**</span> `/event/`: Create a new event.
- <span style="color:orange;">**PUT**</span> `/event/:id`: Update an existing event.
- <span style="color:red;">**DELETE**</span> `/event/:id`: Delete an event.
- <span style="color: #1034a6;">**GET**</span> `/event/`: Get a list of all events.
- <span style="color:lightblue;">**GET**</span> `/event/:id`: Get details of a specific event.
- <span style="color:#b284be;">**GET**</span> `/event/participant/:participantId`: Get events for a specific participant.
- <span style="color:#b28e;">**GET**</span> `/event/search?date=2024-09-30&name=power up&location=prizren`
`/event/search?date=2024-09-30&name=power up`
`/event/search?date=2024-09-30`
`/event/search?`  : Search for an event

## Participant Management Endpoints (`participant.js`):

- <span style="color:green;">**POST**</span> `/participant/`: Register a new participant.
- <span style="color:orange;">**PUT**</span> `/participant/:id`: Update an existing participant.
- <span style="color:red;">**DELETE**</span> `/participant/:id`: Delete a participant.
- <span style="color: #1034a6;">**GET**</span> `/participant/`: Get a list of all participants.
- <span style="color:lightblue;">**GET**</span> `/participant/:id`: Get details of a specific participant.
- <span style="color:#b284be;">**GET**</span> `/participant/event/:eventId`: Get participants registered for a specific event.



# LICENSE
This project is licensed under the MIT License.