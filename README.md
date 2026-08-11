# 🛒 ShopEase – Full Stack E-commerce Platform

## 📌 Overview

**ShopEase** is a full-stack E-commerce web application built using the **React(Frontend) and Go(Backend)**. It provides a seamless online shopping experience with secure authentication, product browsing, shopping cart management, online payments, and order tracking.

The platform supports two user roles—**Customer** and **Administrator**. Customers can browse products, manage their carts, place orders, and track purchases, while administrators can efficiently manage products, categories, users, and orders through a dedicated dashboard.

The application is designed with scalability, security, and responsiveness in mind, ensuring a smooth experience across desktop and mobile devices.

---

# ✨ Features

## Customer Features

* User Registration and Login
* Secure JWT Authentication
* Email Verification
* Password Encryption
* Browse Products
* Product Search
* Product Details Page
* Shopping Cart
* Quantity Management
* Secure Checkout
* Razorpay Payment Gateway Integration
* Order Placement
* Order History
* Order Tracking
* Responsive User Interface
* Profile Management

---

## Admin Features

* Admin Dashboard
* Product Management (Create, Update, Delete)
* Category Management
* Inventory Management
* Order Management
* User Management
* Role-based Authorization
* Sales Monitoring
* Image Upload using Cloudinary

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Context API / Redux (whichever you used)

---

## Backend

* GoLang
* Gin Framework
* MongoDB
* Mongoose

---

## Authentication & Security

* JSON Web Token (JWT)
* bcrypt.js
* Role-Based Access Control
* Protected Routes

---

## Third-Party Integrations

* Razorpay (Payment Gateway)
* Cloudinary (Image Storage)
* SMTP (Email Verification & Order Confirmation)

---

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 🏗️ System Architecture

```text
                 Client (React)
                        │
                        │ REST API
                        ▼
                GoLang + Gin
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
    MongoDB        Cloudinary      Razorpay API
                                      SMTP
```

---

# 📂 Project Structure

```text
ShopEase/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── assets/
│   │   └── utils/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── utils/
│   ├── services/
│   └── server.js
│
├── package.json
├── README.md
└── .env
```

---

# 🚀 Getting Started

## Prerequisites

Install the following software before running the project:

* GoLang
* MongoDB
* Git
* npm

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Amit-yadav099/GoLang-E-commerce.git
```

Navigate to the project directory

```bash
cd shopease
```

Install dependencies

### Backend

```bash
cd backend
go mod tidy
```

### Frontend

```bash
cd ../client
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

# ▶️ Running the Application

Start the backend server

```bash
cd backend
go run main.go
```

Start the frontend

```bash
cd client
npm start
```

Open your browser and visit

```text
http://localhost:3000
```

---

# 🛍️ Application Workflow

1. User registers with email.
2. Email verification is sent using Nodemailer.
3. User logs into the platform.
4. Products are displayed from MongoDB.
5. Users browse and search products.
6. Products are added to the shopping cart.
7. User proceeds to checkout.
8. Razorpay securely processes the payment.
9. Order information is stored in MongoDB.
10. Confirmation email is automatically sent.
11. User can view order history and track orders.
12. Admin manages products, users, and customer orders.

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Role-Based Authorization
* Secure Payment Processing
* Server-side Validation
* Environment Variable Protection

---

# 📱 Responsive Design

The application is optimized for:

* Desktop
* Laptop
* Mobile Devices

---


# 📈 Future Improvements

* Product Reviews and Ratings
* Wishlist Feature
* Coupon and Discount System
* Advanced Product Filters
* AI-based Product Recommendations
* Multiple Payment Gateways
* Invoice Generation
* Multi-vendor Marketplace Support
* Progressive Web App (PWA)
* Real-time Inventory Updates
* Multi-language Support

---

# 🧪 API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/verify-email`

### Products

* GET `/api/products`
* GET `/api/products/:id`
* POST `/api/products`
* PUT `/api/products/:id`
* DELETE `/api/products/:id`

### Cart

* GET `/api/cart`
* POST `/api/cart`
* DELETE `/api/cart/:id`

### Orders

* POST `/api/orders`
* GET `/api/orders`
* GET `/api/orders/:id`

### Payments

* POST `/api/payment/create-order`
* POST `/api/payment/verify`

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is developed for educational and portfolio purposes.

---
