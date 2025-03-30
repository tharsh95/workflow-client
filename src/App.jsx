import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkFlowEditorWrapper from "./components/WorkFlowEditorWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WorkflowProvider>
                  <Dashboard />
                </WorkflowProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflow/new"
            element={
              <ProtectedRoute>
                <WorkflowProvider>
                  <WorkFlowEditorWrapper />
                </WorkflowProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflow/:id/edit"
            element={
              <ProtectedRoute>
                <WorkflowProvider>
                  <WorkFlowEditorWrapper />
                </WorkflowProvider>
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <WorkflowProvider>
                  <FlowEditor />
                </WorkflowProvider>
              </ProtectedRoute>
            }
          /> */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
