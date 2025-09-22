# 🏠 Household Services Application - V2

## 📌 Project Overview

This is a multi-user web application built to provide comprehensive home servicing solutions. The platform facilitates interaction between three key user types: Admins, Service Professionals, and Customers. Customers can book services, Service Professionals manage service requests, and the Admin oversees the platform’s operations.

---

## 🧱 Frameworks & Technologies Used

- **Flask**: Backend API development.
- **VueJS**: Frontend user interface.
- **Bootstrap**: Responsive styling and layout.
- **SQLite**: Lightweight relational database for data storage.
- **Redis**: Caching mechanism to boost performance.
- **Celery**: Background job scheduling and task management.
- **Flask-Mail**: For email-based reminders and reports.

> ⚠️ Note: The application is designed to run fully on a local development environment.

---

## 👥 Roles and Responsibilities

### 1. 🛠️ Admin (Superuser)

- **Access**: No registration required.
- **Responsibilities**:
  - Access admin dashboard after login.
  - View and manage all users (customers + service professionals).
  - Create, update, and delete services.
  - Approve service professionals after verifying documents.
  - Block/unblock customers and professionals for suspicious activity or low reviews.
  - Search professionals for administrative actions.

---

### 2. 👨‍🔧 Service Professional

- **Access**: Requires registration/login.
- **Responsibilities**:
  - Accept/reject assigned service requests.
  - Mark service requests as completed.
  - View personal service history.
- **Attributes**:
  - ID, Name, Created Date, Description, Experience, Service Type
- **Note**: Each professional is tied to a single service type.

---

### 3. 👤 Customer

- **Access**: Requires registration/login.
- **Responsibilities**:
  - Search for services by name/location/pincode.
  - Create, edit, or close service requests.
  - Submit reviews and remarks post service completion.
  - View service professionals based on customer reviews.

---

## 🧾 Key Terminologies

### 🧰 Service

A type of offering available on the platform (e.g., AC Servicing, Plumbing).

- **Fields**:
  - `ID`, `Name`, `Price`, `Time Required`, `Description`, etc.

### 📝 Service Request

Represents a customer's request for a service.

- **Fields**:
  - `id`, `service_id`, `customer_id`, `professional_id`,  
    `date_of_request`, `date_of_completion`,  
    `service_status` (requested/assigned/closed), `remarks`

---

## 🔑 Core Functionalities

### 1. Authentication (RBAC)
- Separate login/register flows for:
  - Admin
  - Service Professionals
  - Customers
- Role-based access using JWT or Flask Security.
- User model supports differentiation between roles.

---

### 2. Admin Dashboard
- Admin login redirects to dashboard.
- Manage all user accounts.
- Approve or block users based on performance or behavior.

---

### 3. Service Management (Admin)
- Create new services with base prices.
- Update service details like name, time, or price.
- Delete obsolete or incorrect services.

---

### 4. Service Requests (Customer)
- Customers can:
  - Create and submit service requests.
  - Edit requests (date/status/remarks).
  - Close service requests after completion.

---

### 5. Search Functionality
- **Customer**: Search services by name, location, pin code.
- **Admin**: Search professionals for review/block actions.

---

### 6. Professional Actions
- View all pending/assigned requests.
- Accept or reject requests.
- Mark services as completed.

---

## ⏱ Background Jobs

### 1. Daily Reminders (Celery + Redis + Mail)
- Triggered in the evening daily.
- Reminds professionals of pending/unaccepted requests.

### 2. Monthly Activity Report (HTML/PDF)
- Generates report of customer's service usage.
- Sent automatically on the first day of each month.

### 3. Export Closed Requests (CSV)
- Triggered manually from Admin Dashboard.
- Exports all closed requests as a CSV file.
- Notifies admin upon completion.

---

## 📐 Application Wireframe

The wireframe serves as a navigational guide for the application. You can use your own UI/UX styles and layouts. Replicating the reference wireframe is **not mandatory**.

---

## 💻 Local Setup & Demo Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/household-services-v2.git
   cd household-services-v2
   ```
   
2.Install backend dependencies:
 ```bash
  pip install -r requirements.txt
```

3.Start Redis server (ensure Redis is installed):
 ```bash
  redis-server
```

4.Start Celery worker:
```bash
  celery -A app.celery worker --loglevel=info
```

5.Run the Flask server:
```bash
  flask run
```

6.Access the application at:
  http://localhost:5000/
  
 ## 🚀 Future Enhancements
Advanced filters and search options.
Charts and analytics for admin dashboard.
Notification systems for service updates.
Single responsive UI for mobile and desktop.

## 🤝 Contributing
Feel free to fork the repo and submit pull requests. For major changes, please open an issue first to discuss what you'd like to improve.
