import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import { injectGlobalStyles } from './styles/colors';
import ReceiptsPage from "./pages/ReceiptsPage";
import DeliveryPage from "./pages/DeliveryPage";
import Stock from "./pages/Stock";
import MoveHistory from "./pages/MoveHistory";
import ReceiptDetails from "./pages/ReceiptDetails";
import WarehousePage from './pages/WarehousePage';
import LocationPage from './pages/LocationPage';
import DeliveryDetails from "./pages/DeliveryDetails";

function App() {
  injectGlobalStyles();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/dashboard" element={<Dashboard/>} /> {/* Dashboard route */}
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/history" element={<MoveHistory />} />
        <Route path="/receipt/:id" element={<ReceiptDetails />} />
        <Route path="/warehouse" element={<WarehousePage />} />
        <Route path="/location" element={<LocationPage />} />

        <Route path="/delivery/:id" element={<DeliveryDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;