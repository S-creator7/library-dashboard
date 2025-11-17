import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import Members from "../pages/Members";
import BooksIssue from "../pages/BooksIssue";
import IssueBook from "../components/IssueBook";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Fines from "../pages/Fines";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page - Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Dashboard Routes - Protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/issue" element={<BooksIssue />} />
          <Route path="/issue-Book" element={<IssueBook />} />
          <Route path="/fines" element={<Fines />} />
        </Route>

        {/* Redirect root to login if not logged in */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
