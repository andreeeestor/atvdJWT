import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:3000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Acesso negado:', error);
        navigate('/login');
      });
    }
  }, [navigate]);

  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.id !== userId)); 
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  return (
    <div>
      <h2>Administração de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li className='liAdm' key={user.id}>
            {user.email} - {user.role}
            {user.role !== 'admin' && ( 
              <button className='btnExcluir' onClick={() => deleteUser(user.id)}>Excluir</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
