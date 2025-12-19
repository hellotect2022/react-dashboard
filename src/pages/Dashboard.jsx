import { useEffect, useRef, useState } from 'react';
import {GridLayout,ReactGridLayout, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import CardLayout from '../components/card/CardLayout';
import { sseAPI } from '../api/api';


export default function Dashboard() {
  const [sseDataThdList, setSseDataThdList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // SSE 연결 (컴포넌트 마운트 시)
  useEffect(() => {
    // SSE 연결 - 기본 메시지 수신
    // const disconnect = sseAPI.connect(
    //   '/test/stream/events?type=thd',  // SSE 엔드포인트 (백엔드 경로에 맞게 수정)
    //   (data) => {
    //     // 메시지 수신 시 처리
    //     //console.log('📨 실시간 데이터:', data);




    //     setSseDataThdList(prev=>{
    //       const updatedList = [...prev, data];
    //       if (updatedList.length > 50) {
    //         // 뒤에서부터 50개만 남깁니다.
    //         return updatedList.slice(-50);
    //       }

    //       return updatedList;
    //     })
    //   },
    //   (error) => {
    //     // 에러 발생 시 처리
    //     console.error('SSE 연결 에러:', error);
    //     setIsConnected(false);
    //   }
    // );

    // // 컴포넌트 언마운트 시 연결 종료
    // return () => {
    //   disconnect();
    //   setIsConnected(false);
    // };
  }, []); // 빈 배열: 마운트/언마운트 시에만 실행


  // useEffect(()=>{
  //   console.log('sseDataThdList',sseDataThdList)
  // },[sseDataThdList])

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

  const anomalyData = [
    { name: 'Vibration', value: 12 },
    { name: 'Thermal', value: 8 },
    { name: 'Temp & Humid', value: 6 },
  ];

  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };    

  const data = [
    {name: 'a', value:95, fill:'#FF6B6B'},
  ]

    // 차트 데이터
  const tempHumData = [
    { ins_time: '14:50',temp:1, value: {s_1:{a:1,b:2}, s_2:{a:2,b:3}} },
    { ins_time: '16:10',temp:2, value: {s_1:{a:2,b:4}, s_2:{a:5,b:7}} },
    
  ];

  // 1. 색상 자동 생성 함수 (Hsl을 쓰면 겹치지 않게 무지개색으로 뽑기 좋습니다)
  const getLineColor = (index, total, isTemp) => {
    const hue = (index * (360 / total)) % 360;
    // 온도는 좀 더 진하게(S: 70%, L: 50%), 습도는 연하게(S: 40%, L: 70%) 구분
    return isTemp ? `hsl(${hue}, 70%, 50%)` : `hsl(${hue}, 40%, 75%)`;
  };

  // 2. 존재하는 모든 장치 ID와 하위 필드(temp, humidity)를 추출하여 변수화
  const dynamicLines = useMemo(() => {
    if (sseDataThdList.length === 0) return [];

    const firstEntryValue = sseDataThdList[0].value;
    const deviceIds = Object.keys(firstEntryValue); // ["deviceId_1", "deviceId_5", ...]
    
    return deviceIds.flatMap((deviceId, idx) => {
      // 숫자만 추출 (이름 표시용)
      const idNum = deviceId.replace('deviceId_', '');
      
      return [
        {
          key: `${deviceId}-temp`,
          dataKey: `value.${deviceId}.temp`,
          name: `${idNum} Temp`,
          stroke: getLineColor(idx, deviceIds.length, true),
        },
        {
          key: `${deviceId}-hum`,
          dataKey: `value.${deviceId}.humidity`,
          name: `${idNum} Hum`,
          stroke: getLineColor(idx, deviceIds.length, false),
        }
      ];
    });
  }, [sseDataThdList]);

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
            <CardLayout key="temp-hum" title="TEMP & HUM">
              <ResponsiveContainer width="100%">
                <LineChart data={sseDataThdList}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="ins_time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  {/* 자동 생성된 변수 배열을 map으로 돌려 Line 출력 */}
                  {dynamicLines.map((line) => (
                    <Line
                      key={line.key}
                      dataKey={line.dataKey}
                      name={line.name}
                      stroke={line.stroke}
                      type="monotone"
                      strokeWidth={2}
                      dot={false}
                      connectNulls={true}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardLayout>

            {/* <CardLayout key="temp-hum" title="TEMP & HUM">
              <ResponsiveContainer width="100%">
                <LineChart data={tempHumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="value.temp" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="value.b" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="value.a" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="value.b" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="value.a" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="value.b" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardLayout> */}


            <CardLayout key="system-health" title="SYSTEM HEALTH">
              <ResponsiveContainer width="100%" className="border-2 border-red-500">
                <RadialBarChart
                  responsive
                  cx="50%"
                  barSize={5}
                  data={data}
                  innerRadius="90%"
                  outerRadius="100%"
                  startAngle={-90}
                  endAngle={270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: '#fff' }} dataKey="value" />
                  {/* <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} /> */}
                </RadialBarChart>
            
              </ResponsiveContainer>
              {/* 2. 중앙 텍스트 (사이즈/색상 마음대로 조절 가능) */}
              <div className="absolute flex flex-col items-center justify-center">
                {/* 숫자와 %가 나란히 있는 상단 영역 */}
                <div className="flex items-baseline">
                  {/* 95 숫자: 크고 굵게 */}
                  <span className="text-4xl font-black text-cyan-400 leading-none">
                    {data[0].value}
                  </span>
                  {/* % 기호: 숫자보다 작게, 살짝 띄워서 */}
                  <span className="text-2xl font-bold text-cyan-400 ml-1">
                    %
                  </span>
                </div>

                {/* 하단 설명 문구: 회색톤으로 아래에 배치 */}
                <span className="text-sm font-medium text-gray-400 mt-2 tracking-wide">
                  At Health
                </span>
              </div>
                
            </CardLayout>
            
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
