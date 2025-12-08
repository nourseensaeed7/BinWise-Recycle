import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
const GuestRoute = ({ children }) => {
  const { isLoggedin, loadingUser } = useContext(AppContent);

  if (loadingUser) {
    return <LoadingSpinner/>;
  }
  if (isLoggedin) {
    return <Navigate to="/" replace />; //redirect logged-in users
  }
  return children;
};

export default GuestRoute;
