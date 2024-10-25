import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    } else {
      axios.get('http://localhost:3000/protected', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log('Dados protegidos:', response.data);
      })
      .catch(() => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
      });
    }
  }, [navigate]);

  return <div>Bem-vindo ao Dashboard - Área Protegida</div>;
};

export default Dashboard;
