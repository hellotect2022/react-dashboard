import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import PasswordChangeModal from '../components/modal/PasswordChangeModal';
import ErrorModal from '../components/modal/ErrorModal';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveConnectionInfo, connectionInfo, isConnected } = useAuth();
  
  const [formData, setFormData] = useState({
    ip: '',
    port: '',
    id: '',
    password: '',
    saveCredentials: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 이미 로그인된 상태면 대시보드로 리다이렉트
  // useEffect(() => {
  //   if (isConnected && connectionInfo.ip) {
  //     const from = location.state?.from?.pathname || '/dashboard';
  //     navigate(from, { replace: true });
  //   }
  // }, [isConnected, connectionInfo, navigate, location]);

  // 저장된 연결 정보가 있으면 불러오기
  useEffect(() => {
    if (connectionInfo.ip) {
      setFormData(prev => ({
        ...prev,
        ip: connectionInfo.ip,
        port: connectionInfo.port,
        id: connectionInfo.id
      }));
    }
  }, [connectionInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (!formData.ip || !formData.port || !formData.id || !formData.password) {
      setErrorMessage('모든 필드를 입력해주세요.');
      setShowErrorModal(true);
      return;
    }

    try {
      // 1. 먼저 연결 정보 저장 (IP, PORT, ID)
      saveConnectionInfo({
        ip: formData.ip,
        port: formData.port,
        id: formData.id
      });

      console.log('🔐 로그인 시도:', {
        ip: formData.ip,
        port: formData.port,
        id: formData.id
      });

      // 2. 실제 API 호출
      const response = await authAPI.login({
        id: formData.id,
        password: formData.password
      });
      
      console.log('✅ 로그인 응답:', response);
      console.log('   응답 전체:', JSON.stringify(response, null, 2));

      // 응답이 있으면 성공으로 간주 (200 OK)
      // 로그인 성공 시 이전 페이지 또는 대시보드로
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // 에러 메시지 상세 분석
      if (error.response) {
        // 서버에서 응답은 왔지만 에러 상태
        const status = error.response.status;
        const message = error.response.data?.message || '서버 에러';
        
        console.error('   상태 코드:', status);
        console.error('   에러 메시지:', message);
        console.error('   응답 데이터:', error.response.data);
        
        if (status === 404) {
          setErrorMessage(`사용자를 찾을 수 없습니다: ${message}`);
        } else if (status === 401) {
          setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setErrorMessage(`로그인 실패 (${status}): ${message}`);
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없음 (CORS, 네트워크 문제)
        console.error('   요청 에러 - 응답 없음');
        setErrorMessage('서버에 연결할 수 없습니다. IP와 PORT를 확인해주세요.');
      } else {
        // 요청 설정 중 에러
        console.error('   설정 에러:', error.message);
        setErrorMessage('로그인 중 오류가 발생했습니다.');
      }
      
      setShowErrorModal(true);
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      // 실제 API 호출 (주석 처리)
      
      const response = await authAPI.changePassword(data);
      if (response.success) {
        alert('비밀번호가 변경되었습니다.');
      }
      
      // 임시
      console.log('비밀번호 변경:', data);
      alert('비밀번호가 변경되었습니다.');
    } catch (error) {
      console.error('Password change error:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* 메인 컨테이너 */}
      <div className="max-w-4xl w-full">
        {/* 타이틀 섹션 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">TWIN-X</h1>
              <p className="text-lg text-gray-600 mt-1">Real Time Monitoring Platform</p>
            </div>
          </div>
        </div>

        {/* 로그인 박스 */}
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <div className="bg-gray-200 text-center py-3 -mx-8 -mt-8 mb-6 rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">LOGIN</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* IP 입력 */}
            <div className="flex items-center flex-1 border border-gray-300 rounded-md">
              <label className="px-4 py-2 bg-gray-50 font-medium text-gray-700 border-r border-gray-300 min-w-[80px]">
                IP
              </label>
              <input
                type="text"
                name="ip"
                value={formData.ip}
                onChange={handleChange}
                placeholder="000.000.000.000"
                className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-r-md"
              />
            </div>

            {/* PORT 입력 */}
            <div className="flex items-center flex-1 border border-gray-300 rounded-md">
              <label className="px-4 py-2 bg-gray-50 font-medium text-gray-700 border-r border-gray-300 min-w-[80px]">
                PORT
              </label>
              <input
                type="text"
                name="port"
                value={formData.port}
                onChange={handleChange}
                placeholder="1234"
                className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-r-md"
              />
            </div>

            {/* ID 입력 */}
            <div className="flex items-center flex-1 border border-gray-300 rounded-md">
              <label className="px-4 py-2 bg-gray-50 font-medium text-gray-700 border-r border-gray-300 min-w-[80px]">
                ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="admin"
                className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-r-md"
              />
            </div>

            {/* PW 입력 */}
            <div className="flex items-center flex-1 border border-gray-300 rounded-md">
              <label className="px-4 py-2 bg-gray-50 font-medium text-gray-700 border-r border-gray-300 min-w-[80px]">
                PW
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="****"
                className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-r-md"
              />
            </div>

            {/* 로그인 버튼 */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-md transition duration-200"
              >
                LOGIN
              </button>
            </div>

            {/* 저장 & 비밀번호 변경 */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="saveCredentials"
                  checked={formData.saveCredentials}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-gray-700">저장</span>
              </label>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-gray-700 hover:text-gray-900 font-medium underline"
              >
                비밀번호 변경
              </button>
            </div>
          </form>

          {/* 버전 정보 */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">v. 2025.12.04</span>
          </div>
        </div>

        {/* MPOLE 로고 */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center text-pink-500 font-bold text-2xl">
            <span className="text-3xl">M</span>POLE
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordChange}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
}

