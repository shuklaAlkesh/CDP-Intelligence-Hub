# CDP Support Agent Chatbot

A chatbot application that helps users with Customer Data Platform (CDP) related questions. The application supports multiple CDPs including **Segment**, **mParticle**, **Lytics**, and **Zeotap**.

## Tech Stack

- **Frontend:** React + TypeScript + Vite  
- **Backend:** Express.js + TypeScript  
- **Database:** PostgreSQL with Drizzle ORM  
- **Styling:** Tailwind CSS + Radix UI Components  

## UI Preview

Here are some screenshots of the **CDP Intelligence Hub** interface:
<p align="center">
  <img src="images/1.png" width="500" hight="500">
  <img src="images/2.png" width="500" hight="500">
  <img src="images/3.png" width="500" hight="500">
</p>

<p align="center">
  <img src="images/4.png" width="500" hight="500">
  <img src="images/5.png" width="500" hight="500">
  <img src="images/6.png" width="500" hight="500">
</p>

## Prerequisites

- Node.js (version 20.x or higher)
- PostgreSQL database

## Project Structure

```
├── client/             # Frontend React application
├── server/             # Backend Express application
├── shared/             # Shared TypeScript types and schemas
└── [config files]      # Various configuration files
```

## Development Commands

```sh
npm run dev      # Start the development server  
npm run build    # Build for production  
npm run start    # Start the production server  
npm run check    # Type check TypeScript files  
npm run db:push  # Push database schema changes  
```

## Features

- **Real-time chat interface:** Engage with the chatbot instantly.
- **Multi-CDP support:** Ask questions about Segment, mParticle, Lytics, or Zeotap.
- **Context-aware responses:** The bot uses relevant documentation sources.
- **Automatic step extraction:** Extracts and presents actionable steps from documentation.
- **Response scoring system:** Provides improved accuracy in responses.

## API Endpoints

- `GET /api/messages` - Retrieve chat history  
- `POST /api/messages` - Send a new message  
- *Additional endpoints* for CDP-specific operations  

## Environment Setup

The backend server is configured to run on port **5000** by default, accessible at:  
`http://0.0.0.0:5000`

### PostgreSQL Connection

Create a PostgreSQL database (for example, named `cdp_support_db`) and set up your connection URL in an environment variable. In your server's `.env` file, add:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cdp_support_db
```

Replace `your_password` with your PostgreSQL password and adjust the database name as needed.

## GitHub Clone and Setup

This project is based on the [CDP Intelligence Hub](https://github.com/shuklaAlkesh/CDP-Intelligence-Hub.git) repository. To get started:

### 1. Clone the Repository

```sh
git clone https://github.com/shuklaAlkesh/CDP-Intelligence-Hub.git
```

### 2. Change into the Project Directory

```sh
cd CDP-Intelligence-Hub
```

### 3. Install Dependencies

- **For the Frontend (client):**

  ```sh
  cd client
  npm install
  ```

- **For the Backend (server):**

  ```sh
  cd ../server
  npm install
  ```

### 4. Set Up Environment Variables

- Create a `.env` file in your **server** directory (if not already provided) and add your PostgreSQL connection string as shown above.
- (If needed, configure other environment variables for the client.)

### 5. Push Database Schema Changes

Ensure your PostgreSQL database is running and then run:

```sh
npm run db:push
```

This will synchronize your database schema using Drizzle ORM.

### 6. Start the Development Servers

- **Backend:**  
  From the **server** directory, run:

  ```sh
  npm run dev
  ```

- **Frontend:**  
  In a separate terminal, from the **client** directory, run:

  ```sh
  npm run dev
  ```

You should now have both the client and server running, and the chatbot application will be accessible per your configuration.

## **Conclusion**  

The **CDP Support Agent Chatbot** is designed to streamline customer interactions by providing **real-time, context-aware** responses for multiple Customer Data Platforms (CDPs), including **Segment, mParticle, Lytics, and Zeotap**. With its **intuitive chat interface, multi-CDP support, and automatic step extraction**, the chatbot serves as an intelligent assistant for users navigating complex CDP documentation.  

Built using a modern **React + TypeScript frontend**, an **Express.js + PostgreSQL backend**, and **Drizzle ORM for database management**, this project ensures **scalability, performance, and maintainability**.  

Future enhancements, such as **enhanced NLP capabilities, AI-driven response generation, and advanced analytics**, will further improve the chatbot's accuracy and user experience.    

🚀 **Happy Coding & Chatbot Building!** 🤖💡  

