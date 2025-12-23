import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { lazy } from 'react';
import Layout from './components/partial/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Thermal = lazy(() => import('./pages/Thermal'));
const TempHum = lazy(() => import('./pages/TempHum'));
const Vibration = lazy(() => import('./pages/Vibration'));
const Setting = lazy(() => import('./pages/Setting'));
const Gems = lazy(() => import('./pages/Gems'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 - 인증 불필요 */}
        <Route path="/" element={<Login />} />
        
        {/* 대시보드 페이지 - 인증 필요 (ProtectedRoute로 보호) */}
        {/* <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}> */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/thermal" element={<Thermal />} />
          <Route path="/temp-hum" element={<TempHum />} />
          <Route path="/vibration" element={<Vibration />} />
          <Route path="/gems" element={<Gems />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
        
        {/* 404 - 존재하지 않는 경로는 로그인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
