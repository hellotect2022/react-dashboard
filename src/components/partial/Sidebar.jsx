import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'thermal', name: '열화상 (Thermal)', icon: '🌡️', path: '/thermal' },
    { id: 'temp-hum', name: '온습도 (Temp & Hum)', icon: '💧', path: '/temp-hum' },
    { id: 'vibration', name: '진동계 (Vibration)', icon: '📳', path: '/vibration' },
    { id: 'settings', name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      {/* 로고 영역 */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700 px-4">
        <div className="flex items-center space-x-2">
          <div className="text-teal-500 font-bold text-2xl">
            <span className="text-3xl">T</span>WIN-X
          </div>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <nav className="mt-6 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors mb-2 text-left"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
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

