import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { EnrollmentProvider } from './context/EnrollmentContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import MyEnrollments from './pages/MyEnrollments.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EnrollmentProvider>
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/curso/:id" element={<CourseDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route
                path="/mis-inscripciones"
                element={
                  <ProtectedRoute>
                    <MyEnrollments />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </EnrollmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
