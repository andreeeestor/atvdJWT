import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', { email, password, role });
      navigate('/login'); 
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
