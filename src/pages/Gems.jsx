import { useState, useEffect } from 'react';
import { useContainerWidth } from 'react-grid-layout';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GemsLiveChartCard from '@/components/card/GemsLiveChartCard';
import { sseAPI } from '@/api/api';

export default function Gems() {
    const [sseDataList, setSseDataList] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // SSE 연결 (한 번만!)
    useEffect(() => {
        const disconnect = sseAPI.connect(
            '/sse/stream/gems',
            (data) => {
                //console.log('⚡ GEMS 데이터 수신:', data);
                setSseDataList(prev => {
                    const updatedList = [...prev, data];
                    if (updatedList.length > 200) {
                        return updatedList.slice(-200);
                    }
                    return updatedList;
                });
                setIsConnected(true);
            },
            (error) => {
                console.error('❌ GEMS SSE 연결 에러:', error);
                setIsConnected(false);
            }
        );

        return () => {
            disconnect();
            setIsConnected(false);
        };
    }, []);

    // Feeder 목록 (실제 데이터에 맞게 조정)
    // 1부터 20까지 모든 feeder 표시
    const feeders = [1,2,3,4,5,6,7,8,10,11,12]

    // 그리드 레이아웃 설정
    const layout = feeders.map((feeder, idx) => ({
        i: "feeder_"+feeder,
        x: 0, //(idx % 2) * 6,  // 2열로 배치
        y: Math.floor(idx / 2) * 3,
        w: 12,
        h: 3
    }));

    const { width, containerRef, mounted } = useContainerWidth();

    // 초기 레이아웃 - 한 번만 로드
    const [currentLayout, setCurrentLayout] = useState(() => {
        const saved = localStorage.getItem('gems-layout');
        const result = saved ? JSON.parse(saved) : layout;
        console.log('layout',result)
        return result
    });

    const handleLayoutChange = (newLayout) => {
        //console.log('Gems 레이아웃 변경:', newLayout);
        setCurrentLayout(newLayout);
        localStorage.setItem('gems-layout', JSON.stringify(newLayout));
    };

    return (
        <div className="w-full h-full bg-gray-900 p-6">
            <div className="mb-6">
                <h1 className="text-[32px] font-bold text-white tracking-tight">
                    전력계 <span className="text-gray-400 font-normal ml-2">(GEMS)</span>
                </h1>
                <p className="text-gray-500 mt-2">실시간 전력 모니터링 시스템</p>
            </div>

            <div ref={containerRef}>
                {mounted && (
                    <ReactGridLayout
                        layout={currentLayout}
                        onLayoutChange={handleLayoutChange}
                        width={width}
                        gridConfig={{ cols: 12, rowHeight: 150, margin: [16, 16] }}
                        isDraggable={true}
                        isResizable={true}
                        compactType={null}
                        preventCollision={false}
                        draggableHandle=".drag-handle"
                    >
                        {feeders.map((feederId) => {
                            //console.log("ff","feeder_"+feederId)
                            return (
                            <GemsLiveChartCard
                                key={"feeder_"+feederId}
                                feederId={feederId}
                                title={`Feeder ${feederId}`}
                                sseDataList={sseDataList}
                                isConnected={isConnected}
                            />
                        )})}
                    </ReactGridLayout>
                )}
            </div>
        </div>
    );
}

