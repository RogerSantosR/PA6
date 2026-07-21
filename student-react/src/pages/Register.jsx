import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.map((x) => x.mensaje).join('. ') : err.response?.data?.message || 'No se pudo registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Nombre completo
          <input name="name" value={form.name} onChange={onChange} required minLength={2} />
        </label>
        <label>
          Correo
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={onChange} required minLength={6} />
        </label>
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creando…' : 'Registrarme'}
        </button>
        <p className="muted center">¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
      </form>
    </div>
  );
}
