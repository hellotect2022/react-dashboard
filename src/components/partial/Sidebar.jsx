import { Activity, Flame, Home, Settings, Thermometer } from 'lucide-react';
import { useNavigate,useLocation } from 'react-router-dom';
import twinxLogo from '@assets/twinx-logo.png'
import { COLORS } from '@/constants/colors';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 정보를 가져옴 (예: /thermal)

  const menuItems = [
    { id: 'dashboard', name: '요약 (Overview)', icon: <Home size={20}/>, path: '/dashboard' },
    { id: 'thermal', name: '열화상 (Thermal)', icon: <Flame size={20}/>, path: '/thermal' },
    { id: 'temp-hum', name: '온습도 (Temp & Hum)', icon: <Thermometer size={20}/> , path: '/temp-hum' },
    { id: 'vibration', name: '진동계 (Vibration)', icon: <Activity size={20}/>, path: '/vibration' },
    { id: 'gems', name: '전력계 (GEMS)', icon: <Activity size={20}/>, path: '/gems' },
    { id: 'settings', name: 'Settings', icon: <Settings size={20}/>, path: '/settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full border-r border-white/5 transition-all duration-300 z-40 
        ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}
        style={{backgroundColor:COLORS.navBg}}
    >
      {/* 로고 영역 */}
      <div className="h-16 flex items-center justify-center px-4" style={{backgroundColor:COLORS.navBg}}>
        <img 
          src={twinxLogo} 
          alt="TWIN-X Logo" 
          style={{ width: '136px', height: '28px' }}
          className="object-contain"
        />
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex-1 mt-0">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-6 py-3.5 transition-colors text-[14px] font-medium ${
                    isActive
                      ? 'bg-[#2C3136] text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단 정보 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          v. 2025.12.04
        </div>
      </div>
    </aside>
  );
}

