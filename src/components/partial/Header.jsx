import { useState, useRef, useEffect } from 'react';
import PasswordChangeModal from '../modal/PasswordChangeModal';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/colors';
import { Bell, ChevronDown, ChevronRight, User } from 'lucide-react';


export default function Header({ onToggleSidebar, isSidebarOpen}) {
  const {connectionInfo, clearConnectionInfo } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      // 실제 API 호출 (주석 처리)
      /*
      await authAPI.logout();
      */
      
      // 연결 정보 초기화
      clearConnectionInfo();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 나도 로그아웃 처리
      clearConnectionInfo();
      navigate('/');
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

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md fixed top-0 right-0 left-0 h-16 z-30 transition-all duration-300"
      style={{ left: isSidebarOpen ? '16rem' : '0' , backgroundColor: COLORS.navBg}}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* 왼쪽: 사이드바 토글 버튼 */}
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle Sidebar">
          <ChevronRight className={isSidebarOpen ? 'rotate-180' : ''} size={28}/>
        </button>

        {/* 오른쪽: 알림 + 프로필 */}
        <div className="flex items-center space-x-4">
          {/* 알림 버튼 */}
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell size={24}/>
            {/* 알림 뱃지 */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 프로필 드롭다운 */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              {/* 프로필 이미지 */}
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                <User size={24} />
              </div>

              {/* 사용자 정보 */}
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium ">{connectionInfo.id || 'Admin'}</div>
                {/* <div className="text-xs text-gray-300">관리자</div> */}
              </div>

              {/* 화살표 */}
              <ChevronDown size={20} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}/>
            </button>

            {/* 프로필 드롭다운 메뉴 */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                {/* 사용자 정보 */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-900">{connectionInfo.id || 'Admin'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {connectionInfo.ip}:{connectionInfo.port}
                  </div>
                </div>

                {/* 메뉴 아이템들 */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // 프로필 페이지로 이동하거나 프로필 모달 열기
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>내 프로필</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // 설정 페이지로 이동
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>설정</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true) && handlePasswordChange();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>비밀번호 변경</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
      {/* 모달들 */}
      <PasswordChangeModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordChange}
      />
    </header>
  );
}

