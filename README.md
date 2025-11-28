# PeydaMishe | پیدا میشه (Backend)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

A modular and scalable backend for a Lost & Found web application, built with **NestJS**, **TypeScript**, **Sequelize**, and **MySQL**.
Handles authentication, post management, ownership claims, notifications, and location-based queries.

---

## ✨ About the Project

PeydaMishe is a university project aimed at helping users post and search for **lost** and **found** items.
The backend follows **NestJS modular architecture** best practices and provides a secure, maintainable, and extendable codebase.

---

## 🧩 Features (Implemented)

### 🔐 Auth Module
- JWT-based authentication
- Role-based access: `admin` / `user`
- Custom Passport strategy
- Pending signup workflow

### 📮 Post Module
- Create **Lost** and **Found** posts
- Multiple images per post (`postImages`)
- Category, subcategory, province, and district assignment
- Query posts for frontend with filtering
- Retrieve detailed post info

### 🧾 Ownership Claim
- Users can submit **owner claims** on found items
- Workflow stored in `ownerClaim` model

### 🔔 Notification Module
- System notifications for:
  - Claim status changes
  - Post updates
  - Account activity

### 🗺️ Location Module
- Provinces, districts, sub-districts
- Post-to-district relationships (`postDistricts`)

### 👤 Admin Module
- Admin-specific endpoints for moderation
- Role checks via JWT

---

## 🛠️ Tech Stack

| Component       | Technology                    |
|-----------------|-------------------------------|
| Framework       | NestJS                        |
| Language        | TypeScript                    |
| Database        | MySQL                         |
| ORM             | Sequelize                     |
| Auth            | JWT + Passport (Custom Strategy) |
| Architecture    | Modular (Modules + Common)    |
| Documentation   | Swagger                       |
| Runtime         | Node.js                       |

---

## 🛢️ Environment Variables

Create a `.env` file:

DB_HOST=localhost

DB_PORT=3306

DB_USER=root

DB_PASS=123456

DB_DATABASE=peydamishe

JWT_SECRET=mySuperSecretKey123

MAIL_USER=example@gmail.com

MAIL_PASS=examplepassword123

FRONT_ORIGIN=http://localhost:3000


---

## ▶️ Running the Project

### Install Dependencies
```bash
npm install
```
```bash
npm run start:dev
```
```bash
npm run start:prod
```

### 📌 Roadmap / TODOs
- Complete admin moderation panel
- Cloud image storage (S3 / Cloudinary)
- Report/block system for posts or users
- Advanced search and filtering
- Multi-language support

## 🔔 Notification Module (Planned / Info)
- When a new post matches a user's existing posts, a **notification is created** in the system
- Additionally, an **email is sent** to notify the user about the match
- Users can see the notification when they log into the website

### 👤 Author
Amirali – Backend Developer (NestJS / TypeScript)
GitHub: https://github.com/amirali3323

## 📄 License

MIT License
