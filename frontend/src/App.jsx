import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Mailpage from "./components/Mailpage";
import History from "./components/History";
import Header from "./components/Header";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>

      {/* Login */}
      <Route
        path="/login"
        element={
          <Login
            onLogin={() => navigate("/send-mail")}
          />
        }
      />

      {/* Send Mail */}
      <Route
        path="/send-mail"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">

              <Header />

              <Mailpage />

            </div>
          </ProtectedRoute>
        }
      />

      {/* History */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">

              <Header />

              <History />

            </div>
          </ProtectedRoute>
        }
      />

      {/* Home */}
      <Route
        path="/"
        element={
          <Navigate to="/send-mail" replace />
        }
      />

      {/* Invalid Routes */}
      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />

    </Routes>
  );
};

export default App;