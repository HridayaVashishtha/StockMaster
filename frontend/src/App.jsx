import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import { injectGlobalStyles } from './styles/colors';
import Stock from "./pages/Stock";
import MoveHistory from "./pages/MoveHistory";

function App() {
  injectGlobalStyles();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard/>} /> {/* Dashboard route */}
        <Route path="/stock" element={<Stock />} />
        <Route path="/" element={<Dashboard/>} />   {/* Dashboard route */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password route */}
        <Route path="/move-history" element={<MoveHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;