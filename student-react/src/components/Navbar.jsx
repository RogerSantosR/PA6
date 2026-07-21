import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">🎓 EduPlatform</Link>
        <nav className="nav-links">
          <NavLink to="/">Catálogo</NavLink>
          {isAuthenticated && <NavLink to="/mis-inscripciones">Mis inscripciones</NavLink>}
          {isAuthenticated ? (
            <>
              <span className="nav-user">Hola, {user?.name?.split(' ')[0]}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Ingresar</NavLink>
              <NavLink to="/registro" className="btn btn-primary btn-sm">Registrarme</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
