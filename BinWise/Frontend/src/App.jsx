import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GuestRoute from "./components/GuestRoute";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AutoRedirect from "./components/AutoRedirect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecycleScanner from "./pages/RecycleScanner";
import PickupAndDropoff from "./pages/PickupAndDropoff";
import Aboutus from "./pages/Aboutus";
import Awareness from "./pages/Awareness";
import AwarenessRecycle from "./pages/AwarenessRecycle";
import AwarenessResourses from "./pages/AwarenessResourses";
import Awarencenotrecycle from "./pages/Awarencenotrecycle";
import FactsStats from "./pages/FactsStats";
import CentersPage from "./pages/CentersPage";
import PickupPage from "./pages/PickupPage";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AutoRedirect />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/recycle-scanner" element={<RecycleScanner />} />

        <Route path="/awareness" element={<Awareness />}>
          <Route index element={<FactsStats />} />
          <Route path="recycle" element={<AwarenessRecycle />} />
          <Route path="resources" element={<AwarenessResourses />} />
          <Route path="not-recycle" element={<Awarencenotrecycle />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/pickup-and-dropoff" element={<PickupAndDropoff />}>
          <Route path="centers" element={<CentersPage />} />
          <Route path="pickup" element={<PickupPage />} />
        </Route>

        <Route path="/about-us" element={<Aboutus />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
