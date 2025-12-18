import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordChangeModal from '../components/modal/PasswordChangeModal';
import Sidebar from '../components/partial/Sidebar';
import Header from '../components/partial/Header'

export default function TempHum() {
  const navigate = useNavigate();
  const { connectionInfo, clearConnectionInfo, getBaseURL } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 대시보드 데이터 가져오기 예제
  const fetchDashboardData = async () => {
    try {
      // const data = await dashboardAPI.getDashboardData();
      // console.log('Dashboard data:', data);
      console.log('API Base URL:', getBaseURL());
      console.log('연결된 사용자:', connectionInfo.id);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>     
    온습도계  화면
    </>
  );
}

