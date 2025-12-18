import { useRef, useState } from 'react';
import {GridLayout,ReactGridLayout, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import CardLayout from '../components/card/CardLayout';


export default function Dashboard() {
  // 그리드 레이아웃 설정
  const layout = [
    { i: 'system-health', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'ai-alerts', x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'device-types', x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'thermal', x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'temp-hum', x: 4, y: 2, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'anomaly-chart', x: 8, y: 2, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'anomaly-bar', x: 0, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'trend', x: 4, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
    { i: 'device-map', x: 8, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 12, maxH: 10 },
  ];

  const { width, containerRef, mounted } = useContainerWidth();

  const getInitialLayout = () => {
    const saved = localStorage.getItem('dashboard-layout');
    return saved ? JSON.parse(saved) : layout;
  };

  const handleLayoutChange = (newLayout) => {
    console.log('현재 레이아웃:', newLayout);
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));


    // 특정 카드의 위치만 확인하려면:
    const systemHealthCard = newLayout.find(item => item.i === 'system-health');
    console.log('System Health 위치:', systemHealthCard);
    // { i: 'system-health', x: 0, y: 0, w: 4, h: 2 }
  };

  const deviceTypeData = [
    { name: 'Thermal', value: 38, color: '#FF6B6B' },
    { name: 'Temp & Hum', value: 31, color: '#4ECDC4' },
    { name: 'Vibration', value: 31, color: '#95E1D3' },
  ];

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

  return (
      <div ref={containerRef}>
        {mounted && (
          <ReactGridLayout
            onLayoutChange={handleLayoutChange}
            // className='border-2 border-red-500'
            layout={getInitialLayout()}
            width={width}
            gridConfig={{ cols: 12, rowHeight: 100, margin: [14,14]}}
            isDraggable={true}
            isResizable={true}
            draggableHandle=".drag-handle"
            compactType={null}
            preventCollision={false}
          >
            <CardLayout key="system-health" title="SYSTEM HEALTH"></CardLayout>
            <CardLayout key="ai-alerts" title="AI ALERTS">
              <div className='flex w-full justify-evenly'>
                <div className='flex flex-col items-center'> 
                <span className="text-7xl font-bold text-pink-500 mt-2">24</span>
                <span className="text-xs text-gray-400">Last 24 Hours</span>
              </div>
              <div className="w-25 h-25 rounded-full border-4 border-orange-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                  <path d="M10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              </div>
            
            </CardLayout>
            <CardLayout key="device-types" title="DEVICE TYPES">
              <ResponsiveContainer width="100%" className="border-2 border-red-500">
                <PieChart>
                  <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value">
                    {deviceTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardLayout>

            <CardLayout key="thermal" title="THERMAL MAX/MIN">
              <ResponsiveContainer width="100%">
              <LineChart data={tempHumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="deviceH" stroke="#FF6B6B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deviceH2" stroke="#A855F7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            </CardLayout>
            
            <CardLayout key="temp-hum" title="TEMP & HUM">
              <ResponsiveContainer width="100%">
                <LineChart data={tempHumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="deviceH" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="deviceH2" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

            </CardLayout>
            
            <CardLayout key="anomaly-chart" title="ANOMALY DETECTION">
              <ResponsiveContainer width="100%">
                <LineChart data={tempHumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="deviceH" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="deviceH2" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardLayout>

            <CardLayout key="anomaly-bar" title="ANOMALI DETECTION">
              <ResponsiveContainer width="100%">
              <BarChart data={anomalyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
            </CardLayout>
            
            <CardLayout key="trend" title="TREND PREDICTION">
              <ResponsiveContainer width="100%">
                <LineChart data={tempHumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="deviceH" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardLayout>
            
            <CardLayout key="device-map" title="DEVICE MAP"></CardLayout>
          </ReactGridLayout>
        )}
      </div>
  );
}
