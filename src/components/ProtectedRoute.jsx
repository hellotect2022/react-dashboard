import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 새로고침 시에도 인증 상태를 확인합니다.
 */
export default function ProtectedRoute({ children }) {
  const { connectionInfo, checkAuth, isAuthChecking } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // 이미 인증 체크 중이면 대기
      if (isAuthChecking) {
        return;
      }

      // 연결 정보가 있으면 인증 확인
      if (connectionInfo.ip && connectionInfo.port) {
        const result = await checkAuth();
        console.log("이건 완전 이상해 씨발",result)
        setIsAuthenticated(result);
      } else {
        setIsAuthenticated(false);
      }
      
      setIsVerifying(false);
    };

    verifyAuth();
  }, [connectionInfo, checkAuth, isAuthChecking]);

  // 로딩 중 (초기 로딩 또는 인증 확인 중)
  if (isAuthChecking || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 인증 성공 - 자식 컴포넌트 렌더링
  return children;
}


