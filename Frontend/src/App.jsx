import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//Universal Core Layout Components
import Footer from './components/Footer'; // Dynamic multi-column footer asset

//Public Pages
import Home from './pages/Home';
import LocationPage from './pages/LocationPage';
import LocationDetails from './pages/LocationDetails';
import Auth from './pages/Auth'; // Accessible customer sign-in/registration gateway

//Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateListing from './pages/admin/CreateListing';
import ManageListings from './pages/admin/ManageListings';
import AdminReservations from './pages/admin/AdminReservations'; // Imported smoothly

//Prevents unauthenticated admin workspace bypass
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'admin') {
    //Kicks back to admin login cleanly if session context is unauthorized
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      {/* This flex configuration establishes a vertical flex-column viewport wrapper.
        It stretches to at least the height of the screen (min-h-screen) and structures layout bounds cleanly.
      */}
      <div className="flex flex-col min-h-screen bg-white">
        
        {/* The main workspace container takes up all available space, forcing the footer downwards */}
        <div className="flex-grow">
          <Routes>
            {/* Public Guest & Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<LocationPage />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            <Route path="/login" element={<Auth />} />
            
            {/* Admin Gateway Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            
            <Route 
              path="/admin/create-listing" 
              element={
                <ProtectedAdminRoute>
                  <CreateListing />
                </ProtectedAdminRoute>
              } 
            />
            
            <Route 
              path="/admin/listings" 
              element={
                <ProtectedAdminRoute>
                  <ManageListings />
                </ProtectedAdminRoute>
              } 
            />

            {/* DEDICATED RESERVATIONS ROUTE (Safely integrated and protected) */}
            <Route 
              path="/admin/reservations" 
              element={
                <ProtectedAdminRoute>
                  <AdminReservations />
                </ProtectedAdminRoute>
              } 
            />

            {/* Fallback Catch-All Redirect */}
            <Route path="*" replace element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Universal Footer Component placed directly inside layout bounds to display across all screens */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;