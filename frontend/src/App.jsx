import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//Universal Core Layout Components
import Footer from './components/Footer'; 

//Public Pages
import Home from './pages/Home';
import LocationPage from './pages/LocationPage';
import LocationDetails from './pages/LocationDetails';
import Auth from './pages/Auth'; 
import MyReservations from './pages/MyReservations'; //FIXED: Imported the guest reservations page

//Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateListing from './pages/admin/CreateListing';
import ManageListings from './pages/admin/ManageListings';
import AdminReservations from './pages/admin/AdminReservations'; 

//Prevents unauthenticated admin workspace bypass
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        
        <div className="flex-grow">
          <Routes>
            {/* Public Guest & Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<LocationPage />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            <Route path="/login" element={<Auth />} />
            
            {/* DEDICATED GUEST ROUTE */}
            <Route path="/my-reservations" element={<MyReservations />} />
            
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

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;