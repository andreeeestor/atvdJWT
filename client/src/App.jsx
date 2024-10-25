import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

function App() {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;
    return token && userRole === 'admin' ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
