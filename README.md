# 🔧 MicroLoan Management System – Backend API

This repository contains the **backend REST API** for the MicroLoan Management System.  
It handles authentication, authorization, loan management, user roles, and loan application processing using **Node.js, Express, and MongoDB**.

---

## 🎯 Purpose

The backend provides a **secure, scalable API** that:
- Manages users and roles (Borrower, Manager, Admin)
- Handles loan products and loan applications
- Enforces role-based access control using JWT
- Serves data to the frontend via RESTful endpoints

---

## 🌐 API Base URL

🔗 **Base URL:**  
[server](https://b12-a11-server-omega.vercel.app/)


---

## 🧰 Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **jsonwebtoken (JWT)** – Authentication & authorization
- **cors** – Cross-Origin Resource Sharing
- **dotenv** – Environment variable management

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Token verification middleware
- Role-based access (Borrower / Manager / Admin)
- Protected routes for sensitive operations

---

## 📁 Core Features

### 👤 User Management
- Create users on first login
- Assign default role (`borrower`)
- Update user roles (approve / suspend)
- Fetch user role by email

### 💳 Loan Management
- Create, update, delete loan products
- Fetch all loans or manager-specific loans
- Toggle loan visibility (`showHome`)
- Search loans by title

### 📝 Loan Applications
- Submit loan applications
- View all applications (Admin)
- View user-specific applications
- Update application status (Pending / Approved / Rejected)

---

## 📌 API Endpoints Overview

## Auth & Users
```http
GET    /users
GET    /users/:email/role
PATCH  /users/:id/role

## Loans
```http
GET    /loans
GET    /manager/:email/loans
POST   /loans
PATCH  /loans/:id
DELETE /loans/:id
PATCH  /loans/:id/show-home


### Loan-Applications
```http
GET    /loans-applications
GET    /my-loans?email=user@email.com
POST   /loans-applications
PATCH  /loans-applications/:id/status
DELETE /myloans/:id

