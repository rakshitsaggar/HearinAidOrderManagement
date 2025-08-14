# Hearing Aid Order Management System

A **full-stack application** for managing hearing aid sales — from **customer consultation** to **delivery and fitting**.  
It helps audiology clinics and hearing aid vendors streamline **customer management, product recommendations, orders, billing, and scheduling appointments**.

---

## 📌 Overview

This system allows you to:
- Maintain **customer records** with hearing loss profiles.
- Manage a **product catalog** of hearing aids.
- Generate **AI-assisted product recommendations** based on hearing loss level and budget.
- Create and track **orders** from ordered → shipped → delivered → fitted.
- Apply **insurance-based discounts**.
- Generate and download **PDF invoices**.
- Manage **appointments** for consultations, fittings, adjustments, etc.
- Get a **dashboard overview** of orders, customers, and system stats.

The frontend is **simple yet modern** (React + Tailwind CSS),  
while the backend is built using **Express.js + Sequelize + SQLite**.

---

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **Sequelize ORM** with **SQLite** storage
- **PDFKit** for invoice generation
- **CORS & REST APIs**
- **JWT authentication ready** (extendable)

### Frontend
- **React.js** + Vite
- **Tailwind CSS**
- **React Router**
- **Axios** for API calls
- **Responsive Design** with Light/Dark Theme

---

## 📂 Project Structure

project-root/
│
├── backend/
│ ├── server.js # Express server entry
│ ├── config/db.js # Sequelize DB config
│ ├── models/ # Sequelize models
│ ├── routes/ # API routes
│ ├── controllers/ # API logic
│ ├── utils/pdfGenerator # Invoice generation helper
│ └── seed/seedData.js # Database seeding
│
├── frontend/
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # App pages
│ │ ├── services/api.js # Axios instance
│ │ └── hooks/useTheme.js
│ ├── public/
│ ├── index.html
│ └── tailwind.config.js
│
└── README.md

text

---

## Setup Instructions

	Clone the repository

	cd hearing-aid-order-management


-> Backend Setup

	cd backend
	npm install
	npm start


Server runs at: (http://localhost:5000)

It will also **sync the database** and seed sample data on first run.

---

### Frontend Setup

	cd frontend
	npm install
	npm run dev

Frontend runs at: (http://localhost:5173)

---

## API Endpoints (Sample)

**Customers**
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PUT /api/customers/:id`

**Products**
- `GET /api/hearing-aids`
- `GET /api/hearing-aids/recommend/:customerId`

**Orders**
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id/status`
- `GET /api/orders/:id/invoice` 

**Appointments**
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`

---

## Sample Workflow

1. **Add Customer**: e.g.  
   _John Smith, moderate hearing loss, ₹70,000 budget_  
2. **Get Recommendations**: Suggested hearing aids fit his needs & budget.  
3. **Place Order**: Select customer + recommended product.  
4. **Generate Invoice**: Includes **30% insurance discount** if applicable.  
5. **Track Order**: Ordered → Shipped → Delivered → Fitted.  
6. **Schedule Appointment**: For fitting or follow-up.

---

## 🎯 Features at a Glance
- 📋 Customer records with hearing profiles
- 🦻 Product recommendation engine
- 🛒 Order creation & tracking
- 📄 PDF invoice generation
- 📅 Appointment scheduling

---

## 👨‍💻 Author
Developed by Rakshit Saggar – focused on building practical, easy-to-use management solutions.