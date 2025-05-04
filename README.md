# ✈️ Flight Booking System - Frontend

This is the frontend application for the **Flight Booking System**. It is built using **React** and provides a user interface for searching, selecting flights, and managing bookings.

## 📌 Features

* Flight search
* Flight details view
* Booking management
* User authentication

## 🛠️ Tech Stack

* **React**
* **React Router** (for navigation)
* **Axios** (for making API requests)
* **MUI UI** (for the UI library)

## 📁 Folder Structure


flight-system-fe/

├── public/

├── src/

│     ├── components/       # Reusable UI components

│     ├── routes/           # Application routes

│     ├── services/         # API service calls

│     ├── utils/            # Utility functions

│     ├── App.js            # Root component

│     └── index.js          # Entry point

├── .env                # Environment variables

└── package.json


## ⚙️ Installation & Setup

### 1. Prerequisites

* [Node.js](https://nodejs.org/en/) (version >= 12)
* [npm](https://www.npmjs.com/) (version >= 6)

### 2. Clone the Repository


git clone https://github.com/amitmungare/flight-system-fe.git

cd flight-system-fe


### 3. Install Dependencies


npm install


### 4. Configure Environment Variables

Create a `.env` file in the root directory with the following content:


REACT_APP_API_BASE_URL=http://localhost:5050/api/v1


Replace `REACT_APP_API_BASE_URL` with the actual URL of your backend API.

### 5. Run the Application


npm start


The application will be running at: `http://localhost:3000`

## 🔗 API Proxy

The application uses a proxy to communicate with the backend server. Ensure your backend server is running at the specified `REACT_APP_API_BASE_URL`.


## 🚀 Deployment


npm run build


This will create an optimized production build in the `build` directory. You can then deploy the contents of this directory to a web server.

## 🧑‍💻 Author

Amit Mungare

* GitHub: [@amitmungare](https://github.com/amitmungare)

