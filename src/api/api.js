import axios from 'axios';

// 개발 모드인지 확인
const isDevelopment = import.meta.env.DEV;

console.log('🔧 개발 모드:', isDevelopment);

// 동적으로 baseURL을 가져오는 함수
function getBaseURL() {
  const savedInfo = localStorage.getItem('connectionInfo');
  if (savedInfo) {
    try {
      const { ip, port } = JSON.parse(savedInfo);
      if (ip && port) {
        return `http://${ip}:${port}/twinx-api`;
      }
    } catch (error) {
      console.error('Failed to parse connection info:', error);
    }
  }
  return '/twinx-api'; // 기본값
}

// Axios 인스턴스 생성 - baseURL은 동적으로 설정
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터 - 매 요청마다 baseURL을 동적으로 설정
api.interceptors.request.use(
  (config) => {
    // 매 요청마다 최신 IP:PORT로 baseURL 설정
    config.baseURL = getBaseURL();
    
    console.log('📤 API 요청:', config.method?.toUpperCase(), config.url);
    console.log('   baseURL:', config.baseURL);
    console.log('   전체 URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('✅ API 응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('❌ Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('❌ Request error (no response)');
      console.error('   요청된 URL:', error.config?.baseURL + error.config?.url);
      console.error('   CORS 또는 네트워크 문제일 수 있습니다.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const authAPI = {
  baseURL : "/api/v1/users",
  // 로그인
  login: async function (credentials) {
    // loginId로 변경!
    const response = await api.post(`${this.baseURL}/login`, {
      loginId: credentials.id,
      password: credentials.password
    });
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async function (data) {
    console.log('?????',data)
    const response = await api.put(`${this.baseURL}/change-password`, data);
    return response.data;
  },
  
  // 인증 확인 (새로고침 시 사용)
  verify: async () => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },
  
  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  
  
  
  // 로그아웃
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  }
};

export const dashboardAPI = {
  // 대시보드 데이터 가져오기
  getDashboardData: async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
  },
  
  // 시스템 상태 가져오기
  getSystemStatus: async () => {
    const response = await api.get('/api/system/status');
    return response.data;
  }
};

// SSE (Server-Sent Events) API
export const sseAPI = {
  // SSE 연결 생성
  connect: (endpoint, onMessage, onError) => {
    const baseURL = "http://localhost:3001"
    const url = `${baseURL}${endpoint}`;
    
    console.log('🔌 SSE 연결 시도:', url);
    
    const eventSource = new EventSource(url, { withCredentials: true });
    
    // 메시지 수신
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        //console.log('📨 SSE 메시지 수신:', data);
        onMessage(data);
      } catch (error) {
        console.error('❌ SSE 데이터 파싱 에러:', error);
        onMessage(event.data);
      }
    };
    
    // 연결 성공
    eventSource.onopen = () => {
      console.log('✅ SSE 연결 성공:', url);
    };
    
    // 에러 발생
    eventSource.onerror = (error) => {
      console.error('❌ SSE 연결 에러:', error);
      if (onError) onError(error);
    };
    
    // 연결 종료 함수 반환
    return () => {
      console.log('🔌 SSE 연결 종료');
      eventSource.close();
    };
  },
  
  // 특정 이벤트 타입 구독
  subscribe: (endpoint, eventType, onMessage, onError) => {
    const baseURL = getBaseURL();
    const url = `${baseURL}${endpoint}`;
    
    console.log(`🔌 SSE 연결 시도 (${eventType}):`, url);
    
    const eventSource = new EventSource(url, { withCredentials: true });
    
    // 특정 이벤트 타입 리스닝
    eventSource.addEventListener(eventType, (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📨 SSE 메시지 수신 (${eventType}):`, data);
        onMessage(data);
      } catch (error) {
        console.error('❌ SSE 데이터 파싱 에러:', error);
        onMessage(event.data);
      }
    });
    
    // 연결 성공
    eventSource.onopen = () => {
      console.log(`✅ SSE 연결 성공 (${eventType}):`, url);
    };
    
    // 에러 발생
    eventSource.onerror = (error) => {
      console.error(`❌ SSE 연결 에러 (${eventType}):`, error);
      if (onError) onError(error);
    };
    
    // 연결 종료 함수 반환
    return () => {
      console.log(`🔌 SSE 연결 종료 (${eventType})`);
      eventSource.close();
    };
  }
};

// 기본 export
export default api;

