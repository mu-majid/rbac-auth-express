# RBAC Express.js App

## Overview

This is a production-ready Node.js and Express.js backend application implementing **Role-Based Access Control (RBAC)** with **dynamic permissions**. The app uses **MongoDB** as the database and provides secure authentication with **JWT** access and refresh tokens. It also supports email verification and password reset via **SendGrid** email integration.

The main features include:

* **Authentication & Authorization:**

  * JWT Access and Refresh Tokens with token revocation.
  * RBAC supporting three primary roles: `admin`, `moderator`, and `user`.
  * Dynamic permissions attached to roles, controlling fine-grained actions on resources.
  * Middleware to protect routes and authorize permissions dynamically.
* **User Management:**

  * User registration with email verification.
  * Login, logout, refresh tokens.
  * Password reset via email link.
  * CRUD operations on users, protected by permissions.
* **Post Management:**

  * Users can create, edit, and delete their own posts.
  * Moderators and admins can approve posts.
  * Admins can hide posts.
  * RBAC permission checks on all post actions.
* **Email Integration:**

  * SendGrid used for sending email verification and password reset emails.
* **API Documentation:**

  * Swagger (OpenAPI) docs for all endpoints.
  * Interactive API docs available at `/api-docs`.
* **Error Handling:**

  * Centralized, consistent error handling middleware.
  * Custom error classes to improve debugging and client feedback.

---

## Tech Stack

* Node.js & Express.js
* MongoDB with Mongoose ODM
* JWT for authentication
* SendGrid for email service
* Swagger for API documentation

---

## Project Structure

```
/controllers
  authController.js
  userController.js
  postController.js
/middleware
  authMiddleware.js
  permissionMiddleware.js
  errorMiddleware.js
/models
  User.js
  Role.js
  Post.js
/routes
  auth.js
  user.js
  post.js
/config
  db.js
  sendgrid.js
app.js
swagger.js
package.json
README.md
```

---

## Setup & Installation

1. Clone the repo:

   ```bash
   git clone <repo-url>
   cd rbac-express-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables (`.env`):

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rbac-app
   JWT_ACCESS_SECRET=youraccesssecret
   JWT_REFRESH_SECRET=yourrefreshsecret
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=no-reply@yourdomain.com
   CLIENT_URL=http://localhost:3000
   ```

4. Start MongoDB locally or use a cloud MongoDB instance.

5. Start the app:

   ```bash
   npm start
   ```

6. Access Swagger API docs at: `http://localhost:5000/api-docs`

---

## Roles and Permissions

The app uses dynamic permissions tied to roles. Example permissions:

| Role      | Permissions                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Admin     | `create:user`, `read:user`, `update:user`, `delete:user`, `create:post`, `approve:post`, `hide:post`, `delete:any_post` |
| Moderator | `read:user`, `update:user`, `approve:post`, `delete:post`                                                               |
| User      | `create:post`, `delete:post` (own posts)                                                                                |

Permissions are checked via middleware before each route execution.

---

## Authentication Flow

* User registers → gets email verification link.
* User verifies email → can login.
* Login returns access and refresh JWT tokens.
* Access token used to authorize API requests.
* Refresh token can be used to get new access tokens.
* Logout revokes the refresh token.
* Password reset can be requested and completed via email link.

---

## Post Resource & Permissions

* Users create posts.
* Moderators and admins can approve posts.
* Admins can hide posts.
* Posts can be deleted by owners or users with `delete:any_post` permission.

---

## Future Enhancements

Here are some directions to make this app even more robust and versatile:

* **OAuth Integration:**
  Add OAuth 2.0 strategies (Google, Facebook, GitHub, etc.) to support third-party login alongside JWT.

* **Rate Limiting & Security:**
  Implement rate limiting, request throttling, and advanced security headers (Helmet) to protect the API from abuse.

* **Multi-Tenancy Support:**
  Add support for multiple organizations/tenants with isolated data and roles.

* **Real-time Notifications:**
  Integrate websockets (e.g., Socket.IO) for real-time alerts on post approvals or user events.

* **Advanced User & Role Management UI:**
  Build a frontend dashboard to manage users, roles, and permissions dynamically.

* **Comprehensive Testing:**
  Add unit, integration, and e2e tests with Jest and Supertest.

* **Caching & Performance:**
  Use Redis for caching tokens and commonly accessed data to improve scalability.

* **Internationalization (i18n):**
  Support multiple languages for email templates and API responses.

---

## Contributing

Feel free to fork, open issues, or submit pull requests to improve the app!

---

## License

MIT License

---