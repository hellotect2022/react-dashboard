import { createContext, useContext, useState, useEffect } from 'react';

// Context 생성
const AuthContext = createContext(null);

// Provider 컴포넌트
export function AuthProvider({ children }) {
  const [connectionInfo, setConnectionInfo] = useState({
    ip: '',
    port: '',
    id: '',
    isConnected: false
  });

  const [isAuthChecking, setIsAuthChecking] = useState(true); // 인증 확인 중 상태

  // 컴포넌트 마운트 시 localStorage에서 불러오기
  useEffect(() => {
    const savedInfo = localStorage.getItem('connectionInfo');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        setConnectionInfo(parsed);
      } catch (error) {
        console.error('Failed to parse connection info:', error);
      }
    }
    setIsAuthChecking(false); // 초기 로딩 완료
  }, []);

  // 연결 정보 저장
  const saveConnectionInfo = (info) => {
    const newInfo = {
      ...connectionInfo,
      ...info,
      isConnected: true
    };
    
    setConnectionInfo(newInfo);
    localStorage.setItem('connectionInfo', JSON.stringify(newInfo));
  };

  // 연결 해제
  const clearConnectionInfo = () => {
    setConnectionInfo({
      ip: '',
      port: '',
      id: '',
      isConnected: false
    });
    localStorage.removeItem('connectionInfo');
  };

  // API Base URL 생성
  const getBaseURL = () => {
    if (connectionInfo.ip && connectionInfo.port) {
      return `http://${connectionInfo.ip}:${connectionInfo.port}`;
    }
    return '';
  };

  // 인증 확인 함수 (새로고침 시 사용)
  const checkAuth = async () => {
    // 연결 정보가 없으면 인증 실패
    if (!connectionInfo.ip || !connectionInfo.port || !connectionInfo.id) {
      return false;
    }

    try {
      // 실제 API 호출하여 인증 확인
      // 예시: GET /api/auth/verify 또는 GET /api/auth/me


      /*
      const response = await fetch(`${getBaseURL()}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();
        // 인증 성공
        if (data.authenticated) {
          // isConnected 상태 유지
          setConnectionInfo(prev => ({
            ...prev,
            isConnected: true
          }));
          return true;
        }
      }
      */
      
      // 인증 실패 - 연결 정보 삭제
      //clearConnectionInfo();

      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // 개발 중에는 연결 정보가 있으면 인증된 것으로 간주 (임시)
      // 실제 배포 시에는 아래 주석 제거하고 위의 실제 API 호출 사용
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 개발 모드: 연결 정보가 있어 인증된 것으로 처리합니다.');
        return true; // 개발 중에는 임시로 true 반환
      }
      
      // clearConnectionInfo();
      return false;
    }
  };

  const value = {
    connectionInfo,
    saveConnectionInfo,
    clearConnectionInfo,
    getBaseURL,
    isConnected: connectionInfo.isConnected,
    checkAuth,
    isAuthChecking
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

