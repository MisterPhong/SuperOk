import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  return (
    <div>
      <h2>Dashboard - Protected Route</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
