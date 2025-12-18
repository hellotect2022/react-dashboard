import { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { connectionInfo, clearConnectionInfo } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      clearConnectionInfo();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      clearConnectionInfo();
      navigate('/');
    }
  };

  const handlePasswordChange = async (data) => {
    console.log('비밀번호 변경:', data);
    alert('비밀번호가 변경되었습니다.');
  };

  // 그리드 레이아웃 설정
  

  // 차트 데이터
  const tempHumData = [
    { time: '14:50', deviceH: 16, deviceH2: 40 },
    { time: '16:10', deviceH: 18, deviceH2: 38 },
    { time: '14:30', deviceH: 20, deviceH2: 42 },
    { time: '14:59:40', deviceH: 22, deviceH2: 45 },
  ];

  const anomalyData = [
    { name: 'Vibration', value: 12 },
    { name: 'Thermal', value: 8 },
    { name: 'Temp & Humid', value: 6 },
  ];

  const deviceTypeData = [
    { name: 'Thermal', value: 38, color: '#FF6B6B' },
    { name: 'Temp & Hum', value: 31, color: '#4ECDC4' },
    { name: 'Vibration', value: 31, color: '#95E1D3' },
  ];

  const layout = [
    { i: 'system-health', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'ai-alerts', x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'device-types', x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'thermal', x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'temp-hum', x: 4, y: 2, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'anomaly-chart', x: 8, y: 2, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'anomaly-bar', x: 0, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'trend', x: 4, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
    { i: 'device-map', x: 8, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 4 },
  ];

  return (
        <GridLayout
          className="layout border-2 border-red-500"
          layout={layout}
          cols={12}
          rowHeight={150}
          width={1200}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".drag-handle"
          compactType="vertical"
          preventCollision={false}
          margin={[16, 16]}
        >
         <div key="system-health" className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
           <h3 className="drag-handle cursor-move text-teal-400 text-sm font-bold mb-2 text-center py-2">SYSTEM HEALTH</h3>
          <div className="flex items-center justify-center h-32">
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" strokeWidth="8"
                  strokeDasharray="251.2" strokeDashoffset="25.12"
                  transform="rotate(-90 50 50)" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-teal-400">95</span>
                <span className="text-xs text-gray-400">At Health</span>
              </div>
            </div>
          </div>
        </div>

         {/* 2. AI Alerts */}
         <div key="ai-alerts" className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
           <h3 className="drag-handle cursor-move text-teal-400 text-sm font-bold mb-2 text-center py-2">AI ALERTS</h3>
          <div className="flex flex-col items-center justify-center h-32">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-orange-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                  <path d="M10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            <span className="text-4xl font-bold text-pink-500 mt-2">24</span>
            <span className="text-xs text-gray-400">Last 24 Hours</span>
          </div>
        </div>

        {/* 3. Device Types */}
        <div key="device-types" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
          <h3 className="text-teal-400 text-sm font-bold mb-2 text-center">DEVICE TYPES</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Thermal Max/Min */}
          <div key="thermal" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
            <h3 className="text-teal-400 text-sm font-bold mb-2">THERMAL MAX/MIN</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={tempHumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="deviceH" stroke="#FF6B6B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deviceH2" stroke="#A855F7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 5. Temp & Hum */}
          <div key="temp-hum" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
            <h3 className="text-teal-400 text-sm font-bold mb-2">TEMP & HUM</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={tempHumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="deviceH" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="deviceH2" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 6. Anomaly Detection Chart */}
          <div key="anomaly-chart" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
            <h3 className="text-teal-400 text-sm font-bold mb-2">ANOMALY DETECTION</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={tempHumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="deviceH" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="deviceH2" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 7. Anomaly Detection Bar */}
          <div key="anomaly-bar" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
            <h3 className="text-teal-400 text-sm font-bold mb-2">ANOMALI DETECTION</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={anomalyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 8. Trend Prediction */}
          <div key="trend" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
            <h3 className="text-teal-400 text-sm font-bold mb-2">TREND PREDICTION</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={tempHumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="deviceH" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 9. Device Map */}
          <div key="device-map" className="drag-handle cursor-move bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative">
            <h3 className="text-teal-400 text-sm font-bold mb-2">DEVICE MAP</h3>
            <div className="h-32 flex items-center justify-center relative">
              {/* 임시 맵 표시 */}
              <div className="w-full h-full bg-gray-900 rounded relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 3 L17 17 M17 3 L3 17" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-teal-400 rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
      </GridLayout>
  );
}
