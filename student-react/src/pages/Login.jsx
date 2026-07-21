import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Correo
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tucorreo@isil.edu.pe" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="muted center">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        <p className="hint">Demo estudiante: <code>estudiante@isil.edu.pe</code> / <code>Estudiante123*</code></p>
      </form>
    </div>
  );
}
