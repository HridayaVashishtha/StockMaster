import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Stock from "./pages/Stock";
import MoveHistory from "./pages/MoveHistory";
import ReceiptsPage from "./pages/ReceiptsPage";
import ReceiptDetails from "./pages/ReceiptDetails";
import WarehousePage from './pages/WarehousePage';
import LocationPage from './pages/LocationPage';
import DeliveryPage from "./pages/DeliveryPage";
import DeliveryDetails from "./pages/DeliveryDetails";
import AdjustmentsPage from "./pages/AdjustmentsPage";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/landing" element={<Landing />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/stock"
          element={isAuthenticated ? <Stock /> : <Navigate to="/login" />}
        />
        <Route
          path="/move-history"
          element={isAuthenticated ? <MoveHistory /> : <Navigate to="/login" />}
        />
        <Route
          path="/warehouse"
          element={isAuthenticated ? <WarehousePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/location"
          element={isAuthenticated ? <LocationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/receipts"
          element={isAuthenticated ? <ReceiptsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/receipt/:id"
          element={isAuthenticated ? <ReceiptDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/deliveries"
          element={isAuthenticated ? <DeliveryPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/delivery/:id"
          element={isAuthenticated ? <DeliveryDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/adjustments"
          element={isAuthenticated ? <AdjustmentsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/product/:id"
          element={isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
