import PembayaranList from '../components/PembayaranList';
import { isAuthenticated } from '../auth';
import { Navigate } from 'react-router-dom';

function PembayaranPage() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <PembayaranList />;
}

export default PembayaranPage;