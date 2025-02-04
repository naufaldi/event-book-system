## API Contract for Event Booking System

Let's define the **core API endpoints** using **RESTful principles**.

### **Authentication**

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| `POST` | `/auth/register` | Register a new user             |
| `POST` | `/auth/login`    | User login (JWT authentication) |
| `GET`  | `/auth/me`       | Get authenticated user profile  |

### **Events**

| Method   | Endpoint      | Description                           |
| -------- | ------------- | ------------------------------------- |
| `GET`    | `/events`     | Get all events                        |
| `GET`    | `/events/:id` | Get event details                     |
| `POST`   | `/events`     | Create a new event (Admin only)       |
| `PUT`    | `/events/:id` | Update an existing event (Admin only) |
| `DELETE` | `/events/:id` | Delete an event (Admin only)          |

### **Tickets**

| Method   | Endpoint              | Description                        |
| -------- | --------------------- | ---------------------------------- |
| `GET`    | `/events/:id/tickets` | Get available tickets for an event |
| `POST`   | `/tickets/book`       | Book a ticket for an event         |
| `GET`    | `/tickets/:id`        | Get ticket details                 |
| `DELETE` | `/tickets/:id/cancel` | Cancel a ticket booking            |

### **Reservations**

| Method | Endpoint            | Description                                 |
| ------ | ------------------- | ------------------------------------------- |
| `GET`  | `/reservations`     | Get all reservations for authenticated user |
| `POST` | `/reservations`     | Reserve an event (without booking a seat)   |
| `PUT`  | `/reservations/:id` | Confirm or cancel reservation               |

---

## **3. API Contract - Request & Response Format**

### **Authentication API**

#### `POST /auth/register`

- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "JWT_TOKEN"
  }
  ```

#### `POST /auth/login`

- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "JWT_TOKEN"
  }
  ```

---

### **Events API**

#### `GET /events`

- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Tech Conference 2025",
      "description": "A conference for tech enthusiasts",
      "startTime": "2025-05-10T10:00:00Z",
      "endTime": "2025-05-10T17:00:00Z",
      "venue": "Jakarta Convention Center"
    }
  ]
  ```

#### `POST /events` (Admin Only)

- **Request Body:**
  ```json
  {
    "name": "Tech Conference 2025",
    "description": "A conference for tech enthusiasts",
    "startTime": "2025-05-10T10:00:00Z",
    "endTime": "2025-05-10T17:00:00Z",
    "venue": "Jakarta Convention Center"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "name": "Tech Conference 2025",
    "startTime": "2025-05-10T10:00:00Z",
    "venue": "Jakarta Convention Center"
  }
  ```

---

### **Ticket Booking API**

#### `POST /tickets/book`

- **Request Body:**
  ```json
  {
    "userId": 1,
    "eventId": 2,
    "seatNumber": "A12"
  }
  ```
- **Response:**
  ```json
  {
    "ticketId": 101,
    "eventId": 2,
    "userId": 1,
    "seatNumber": "A12",
    "status": "booked"
  }
  ```

#### `DELETE /tickets/:id/cancel`

- **Response:**
  ```json
  {
    "message": "Booking cancelled successfully"
  }
  ```

---

### **Reservations API**

#### `POST /reservations`

- **Request Body:**
  ```json
  {
    "userId": 1,
    "eventId": 2
  }
  ```
- **Response:**
  ```json
  {
    "reservationId": 99,
    "userId": 1,
    "eventId": 2,
    "status": "pending"
  }
  ```

#### `PUT /reservations/:id`

- **Request Body (to confirm reservation):**

  ```json
  {
    "status": "confirmed"
  }
  ```

- **Response:**
  ```json
  {
    "reservationId": 99,
    "status": "confirmed"
  }
  ```
