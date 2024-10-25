import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const token = response.data.token;
      
      localStorage.setItem('token', token); 
      
      const payload = decodeToken(token); 
      if (payload && payload.role === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
