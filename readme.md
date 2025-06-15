# Inventory Manager 2025

**Inventory Manager 2025** is a full-stack inventory and quotation management system designed to help businesses efficiently manage their product inventory, suppliers, clients, and client quotations. It provides real-time stock tracking, supplier-product relationships, and a clean user interface for managing and fulfilling quotations.

---

## 🚀 Features (Completed)

### 🔹 Client Management

- Add new clients

### 🔹 Supplier & Product Management

- Add suppliers and link them to products
- Manage products with:
  - Initial stock
  - Current stock
  - Reserved stock (for approved quotations)
  - Cost price, category, and image

### 🔹 Quotation Workflow

- Create quotations for clients based on product-supplier links
- Approve quotations (reserves stock)
- Fulfill quotations (reduces actual stock)

### 🔹 Inventory Control

- Smart reservation logic to prevent stock conflicts
- Stock logs maintained for every transaction

### 🔹 Stock Log Tracking

- Logs every stock change (approval, fulfillment) with:
  - Reference ID
  - Change type (increase/decrease)
  - Source and quantity

### 🔹 Frontend Interface

- React-based frontend with clean UI
- Plain CSS styling (no UI libraries)
- Dynamic dropdowns and display cards

---

## 🛠️ Work in Progress / To Do

The following features are **planned** or **in progress**:

- [ ] **Edit and delete** capabilities for:

  - Clients
  - Suppliers
  - Products

- [ ] **Search and filter** functionality for:

  - Clients
  - Products
  - Suppliers
  - Quotations

- [ ] **Reorder level alerts** for products (stock below threshold)

- [ ] **Quotation enhancements**:

  - Reject quotation (releases reserved stock)
  - Delete quotation

- [ ] **Reports** module (basic inventory, quotation history, reorder needs)

- [ ] **Authentication**
  - Not implemented yet
  - Planned: JWT-based authentication with user roles (e.g., Admin, Staff)

---

## 🧱 Tech Stack

### Backend

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- RESTful API architecture
- Modular controllers, models, and routes
- Async/await for logic handling

### Frontend

- **React**
- **Axios** for API requests
- Styled with **plain CSS**

### Folder Structure

inventory-manager-2025/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
| ├── middleware/
│ ├── config/
│ └── index.js
├── frontend/
│ ├── components/
│ ├── pages/
| ├── images/
| ├── styles/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
