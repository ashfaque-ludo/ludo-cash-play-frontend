import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Wallet from "@/pages/Wallet";
import MatchLobby from "@/pages/MatchLobby";
import MatchRoom from "@/pages/MatchRoom";
import Leaderboard from "@/pages/Leaderboard";
import Referral from "@/pages/Referral";
import Admin from "@/pages/Admin";
import Legal from "@/pages/Legal";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/legal" element={<Legal />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/play" element={<ProtectedRoute><MatchLobby /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute><MatchRoom /></ProtectedRoute>} />
            <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireRole="support_agent"><Admin /></ProtectedRoute>} />
            <Route path="/super-admin" element={<ProtectedRoute requireRole="super_admin"><Admin /></ProtectedRoute>} />
          </Routes>
          <Footer />
          <Toaster theme="dark" position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
