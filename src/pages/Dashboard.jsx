import { useEffect, useRef, useState } from 'react';
import {GridLayout,ReactGridLayout, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import CardLayout from '../components/card/CardLayout';
import { sseAPI } from '../api/api';
import OperationRateCard from '@/components/card/OperationRateCard';
import DeviceTypeCard from '@/components/card/DeviceTypeCard';
import AnomalySummaryCard from '@/components/card/AnomalySummaryCard';
import LiveChartCard from '@/components/card/LiveChartCard';
import AlarmCountCard from '@/components/card/AlarmCountCard';
import ThdLiveChartCard from '@/components/card/ThdLiveChartCard';
import SeismoLiveChartCard from '@/components/card/SeismoLiveChartCard';
import EocLiveChartCard from '@/components/card/EocLiveChartCard';


export default function Dashboard() {
  const [sseDataThdList, setSseDataThdList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // SSE 연결 (컴포넌트 마운트 시)
  useEffect(() => {
  //   // //SSE 연결 - 기본 메시지 수신
  //   const disconnect = sseAPI.connect(
  //     '/test/stream/events?type=thd',  // SSE 엔드포인트 (백엔드 경로에 맞게 수정)
  //     (data) => {
  //       // 메시지 수신 시 처리
  //       //console.log('📨 실시간 데이터:', data);




  //       setSseDataThdList(prev=>{
  //         const updatedList = [...prev, data];
  //         if (updatedList.length > 50) {
  //           // 뒤에서부터 50개만 남깁니다.
  //           return updatedList.slice(-50);
  //         }

  //         return updatedList;
  //       })
  //     },
  //     (error) => {
  //       // 에러 발생 시 처리
  //       console.error('SSE 연결 에러:', error);
  //       setIsConnected(false);
  //     }
  //   );

  //   // 컴포넌트 언마운트 시 연결 종료
  //   return () => {
  //     disconnect();
  //     setIsConnected(false);
  //   };
  }, []); // 빈 배열: 마운트/언마운트 시에만 실행


  // useEffect(()=>{
  //   console.log('sseDataThdList',sseDataThdList)
  // },[sseDataThdList])

  // 그리드 레이아웃 설정
  const layout = [
  
    {i: "system-health", x: 0, y: 0, w: 4, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 10},
    {i: "ai-alerts", x: 4, y: 0, w: 4, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 10},
    {i: "device-types", x: 8, y: 0, w: 4, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 10},
    {i: "temp-hum", x: 4, y: 3, w: 4, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 10},
    {i: "thermal", x: 0, y: 3, w: 4, h: 3, moved: false, static: false},
    {i: "vibration", x: 8, y: 3, w: 4, h: 3, moved: false, static: false},
    {i: "anomaly-chart", x: 0, y: 6, w: 4, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 10},
    {i: "trend", x: 4, y: 6, w: 4, h: 3, moved: false, static: false},
    {i: "device-map", x: 8, y: 6, w: 4, h: 3, moved: false, static: false}
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

  const handleResize = (layout, oldItem, newItem, placeholder, e, element) => {
    console.log('🔄 Resize 발생!');
    console.log('카드 key:', newItem.i);
    console.log('새 크기:', { w: newItem.w, h: newItem.h });
    console.log('이전 크기:', { w: oldItem.w, h: oldItem.h });
  };

  const handleResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
    console.log('✅ Resize 완료!');
    console.log('카드 key:', newItem.i);
    console.log('최종 크기:', { w: newItem.w, h: newItem.h });
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
    {name: 'a', value:95, fill:'#FF6B6B'}
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
        <h1 className="text-[24px] font-bold text-white tracking-tight">
          요약 <span className="text-gray-400 font-normal ml-1">(Overview)</span>
        </h1>
        {mounted && (
          <ReactGridLayout
            onLayoutChange={handleLayoutChange}
            onResize={handleResize}
            onResizeStop={handleResizeStop}
            // className='border-2 border-red-500'
            layout={getInitialLayout()}
            width={width}
            gridConfig={{ cols: 12, rowHeight: 100, margin: [14,14]}}
            isDraggable={true}
            isResizable={true}
                        
            compactType={null}
            preventCollision={false}
          >
            

            <OperationRateCard key="system-health" title="정상 가동률" data={data}/>
            <AlarmCountCard key="ai-alerts" title="알람 건수" data={null}/>
            <DeviceTypeCard key="device-types" title="장치 유형별 개수" data={null}/>
            

            {/* <LiveChartCard key="temp-hum" type="thd" title="온습도 (Temp & Hum)" data={sseDataThdList} /> */}
            <ThdLiveChartCard key="temp-hum" type="thd" title="온습도 (Temp & Hum)"/>
            {/* <LiveChartCard key="thermal" type="eoc" title="열화상 (Max & Min)" data={sseDataThdList} /> */}
            <EocLiveChartCard key="thermal" type="eoc" title="열화상 (Max & Min)"/>
            <SeismoLiveChartCard key="vibration" type="seismo" title="진동계 (RMS & Peak)"/>
            {/* <LiveChartCard key="vibration" type="seismo" title="진동계 (RMS & Peak)" data={sseDataThdList} /> */}

            <AnomalySummaryCard key="anomaly-chart" title="이상 감지 건수 요약" data={anomalyData}/>
            {/* <LiveChartCard key="trend" title="예측분석결과표시" data={null} />
            <LiveChartCard key="device-map" title="장치 위치 기반 상태 시각화" data={null} /> */}

            
          </ReactGridLayout>
        )}
      </div>
  );
}
