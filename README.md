# Order Management System

A modern Vue.js application for managing orders, customers, and sales representatives.

## Features

- ✅ Order Management (Create, Read, Update, Delete)
- ✅ Customer Management
- ✅ Sales Representative Management
- ✅ PDF Invoice Generation
- ✅ Reports and Analytics
- ✅ Mobile Responsive Design
- ✅ Real-time Status Updates
- ✅ User Authentication with Supabase

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd order-management-system
```

2. Install dependencies
```bash
npm install
```

3. Configure Supabase
- Update `src/config.js` with your Supabase credentials
- Run the SQL schema in your Supabase database

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── assets/          # Static assets (CSS, fonts)
├── components/      # Reusable Vue components
├── layouts/         # Layout components
├── router/          # Vue Router configuration
├── services/        # API services
├── utils/           # Utility functions
├── views/           # Page components
├── App.vue          # Root component
├── main.js          # Application entry point
└── config.js        # Configuration file
```

## Configuration

Update `src/config.js` with your Supabase credentials:

```javascript
export const config = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
}
```

## Features Overview

### Order Management
- Create new orders with multiple products
- Update order status directly from list view
- Generate PDF invoices
- Track order history

### User Management
- Role-based access control (Admin, Sales Manager, Representative)
- User profile management
- Authentication and authorization

### Reports
- Sales reports with filtering
- Export to PDF
- Analytics dashboard

### Mobile Support
- Fully responsive design
- Touch-friendly interface
- Mobile-optimized PDF generation

## License

MIT License

