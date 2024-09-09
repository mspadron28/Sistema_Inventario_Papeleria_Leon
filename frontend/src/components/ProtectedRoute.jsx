import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, ...props }) => {
  return isAuthenticated ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
