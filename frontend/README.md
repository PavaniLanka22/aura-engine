# Aura Engine

Aura Engine is a full-stack enterprise inventory management and analytics system built to efficiently handle large-scale inventory data.

The application provides real-time inventory visibility, optimized search and filtering, analytics dashboards, validation, and caching for improved performance.

## Features

- Inventory management with search, filtering, sorting, and pagination
- Support for 50,000+ inventory records
- MongoDB indexing for optimized queries
- MongoDB aggregation pipelines for analytics
- Redis caching for improved API performance
- Inventory valuation and restock analytics
- Category-wise portfolio distribution
- Product validation and business-rule enforcement
- Inventory export functionality
- Responsive dashboard and inventory interface
- Environment-based configuration for deployment

## Tech Stack

**Frontend**
- React.js
- Vite
- Axios
- Recharts
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- Zod/Joi

**Tools**
- Git & GitHub
- Postman
- MongoDB Atlas

## Key APIs

GET    /api/inventory
POST   /api/inventory
PUT    /api/inventory/:id
DELETE /api/inventory/:id
GET    /api/analytics
GET    /api/inventory/export