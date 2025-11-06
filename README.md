# 🏠 Property Management System

A complete, full-stack property management application built with React and Node.js. Features user registration, property management, advanced search, application system, and image uploads.

## ✨ Features

### 🔐 **Authentication & Users**
- **User Registration** with role selection (Admin/Owner/Tenant)
- **Secure Login** with session management
- **Role-based Access Control** with different dashboards
- **Password Hashing** with bcrypt

### 🏡 **Property Management**
- **Create & Edit Properties** with detailed information
- **Image Upload** (one image per property, stored on server)
- **Property Status Management** (Available/Occupied/Maintenance)
- **Advanced Search** with filters (price, bedrooms, property type)
- **Property Details** page with full information

### 📝 **Application System**
- **Tenant Applications** with personal details and income
- **Owner/Admin Approval** system (approve/reject)
- **Application Tracking** for tenants
- **Automatic Status Updates** when applications are approved

### 📊 **Dashboards**
- **Admin Dashboard**: User management and system overview
- **Owner Dashboard**: Property management and application reviews
- **Tenant Dashboard**: Property search and application tracking
- **Statistics & Analytics** for owners and admins

### 🎨 **Modern UI/UX**
- **Responsive Design** works on all devices
- **SweetAlert2 Notifications** for user feedback
- **Lucide Icons** for beautiful interface
- **TailwindCSS** for modern styling

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router DOM** for navigation
- **TailwindCSS** for styling
- **SweetAlert2** for notifications
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with proper relationships
- **Express Sessions** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 🚀 Quick Setup

### Prerequisites
- **Node.js 18+** 
- **PostgreSQL 13+**
- **Git**

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd property-management
```

### 2. Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE property_management;
```

Run the database schema:
```bash
# Connect to your PostgreSQL database and run:
psql -U your_username -d property_management -f FINAL_create_tables.sql
```

### 3. Environment Configuration
Create `.env` file in the `server` directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/property_management
SESSION_SECRET=your-super-secret-key-change-this-in-production
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Seed Sample Data (Optional)
```bash
cd server
node FINAL_seed_data.js
```

This creates sample users and properties:
- **Admin**: admin@example.com / password123
- **Owner**: owner@example.com / password123  
- **Tenant**: tenant@example.com / password123

### 6. Start the Application
```bash
# Terminal 1 - Start Backend Server
cd server
npm run dev

# Terminal 2 - Start Frontend Client
cd client
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## 📂 Project Structure

```
property-management/
├── client/                     # React Frontend
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SimplePropertyForm.jsx
│   │   ├── context/           # React Context (Auth)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── TenantDashboard.jsx
│   │   │   ├── PropertySearch.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── PropertyApplications.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── api/               # API client configuration
│   │   │   └── api.js
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Backend
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   └── propertyApplicationController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/                # Database models
│   │   ├── userModel.js
│   │   ├── propertyModel.js
│   │   └── propertyApplicationModel.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── propertyApplications.js
│   │   └── admin.js
│   ├── uploads/               # File uploads directory
│   │   └── properties/        # Property images
│   ├── sql/                   # Database scripts
│   │   └── create_tables.sql
│   ├── app.js                 # Express app configuration
│   ├── db.js                  # Database connection
│   ├── package.json
│   └── .env                   # Environment variables
├── FINAL_create_tables.sql    # Complete database schema
├── FINAL_seed_data.js         # Sample data script
└── README.md                  # This file
```

## 🎯 User Roles & Workflows

### 👤 **Tenants**
1. **Register** → Choose "Tenant" role
2. **Search Properties** → Use filters (price, bedrooms, type)
3. **View Details** → Click on any property
4. **Apply** → Submit application with income details
5. **Track Status** → View applications in dashboard

### 🏠 **Property Owners**
1. **Register** → Choose "Owner" role
2. **Add Properties** → Fill form + upload images
3. **Manage Listings** → Edit details, update images
4. **Review Applications** → Approve or reject tenant requests
5. **Track Statistics** → View dashboard analytics

### ⚙️ **Administrators**
1. **Register** → Choose "Admin" role
2. **Manage Users** → Create, view, delete users
3. **System Overview** → Access all properties and applications
4. **Platform Control** → Full system administration

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Properties
- `GET /properties/search` - Search properties with filters
- `GET /properties/available` - Get all available properties
- `GET /properties/:id` - Get property details
- `POST /properties` - Create property (with image)
- `PUT /properties/:id/details` - Update property details
- `PUT /properties/:id/image` - Update property image
- `DELETE /properties/:id` - Delete property

### Applications
- `GET /property-applications` - Get user's applications
- `POST /property-applications` - Submit application
- `PUT /property-applications/:id/status` - Update application status
- `DELETE /property-applications/:id` - Delete application

### Admin
- `GET /admin/users` - Get all users
- `POST /admin/create-user` - Create new user
- `DELETE /admin/user/:id` - Delete user

## 🔒 Security Features

- **Password Hashing** with bcrypt (10 rounds)
- **Session Management** with express-session
- **Role-based Access Control** middleware
- **File Upload Validation** (images only, 5MB limit)
- **SQL Injection Prevention** with parameterized queries
- **CORS Configuration** for secure cross-origin requests

## 📱 Features in Detail

### Image Upload System
- **One image per property** (no duplicates)
- **Automatic file naming** (`property-{id}.extension`)
- **Old image cleanup** when updating
- **Image preview** in forms
- **Responsive display** across all views

### Search & Filtering
- **Text search** in title, description, address
- **Price range** filtering (min/max rent)
- **Bedroom count** filtering
- **Property type** filtering (apartment, house, condo, etc.)
- **Real-time results** with loading states

### Application Management
- **Simple application form** (message + income)
- **Status tracking** (pending, approved, rejected)
- **Email notifications** (ready for implementation)
- **Automatic property updates** when approved

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
cd server
node -e "
const pool = require('./db.js').default;
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? 'Error: ' + err : 'Connected: ' + res.rows[0].now);
  pool.end();
});
"
```

### Port Conflicts
- **Backend**: Change `PORT` in `.env` file
- **Frontend**: Change port in `vite.config.js`

### Image Upload Issues
- Ensure `uploads/properties/` directory exists
- Check file permissions on server
- Verify `CORS_ORIGIN` in `.env`

### Common Fixes
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reset database
psql -U username -d property_management -f FINAL_create_tables.sql
```

## 🔄 Development

### Adding New Features
1. **Backend**: Add routes → controllers → models
2. **Frontend**: Add pages → components → API calls
3. **Database**: Update schema → run migrations

### Environment Variables
```env
# Development
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/property_management
SESSION_SECRET=dev-secret-key
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Production
NODE_ENV=production
DATABASE_URL=your-production-database-url
SESSION_SECRET=super-secure-production-key
PORT=4000
CORS_ORIGIN=https://yourdomain.com
```

## 📦 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables
- Configure PostgreSQL database
- Set up file storage (local or cloud)

### Frontend (React)
- Build: `npm run build`
- Deploy to Netlify, Vercel, or serve statically
- Update API URLs for production

### Database
- Use managed PostgreSQL (Heroku Postgres, Railway, etc.)
- Run `FINAL_create_tables.sql` on production database
- Optionally run `FINAL_seed_data.js` for sample data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

