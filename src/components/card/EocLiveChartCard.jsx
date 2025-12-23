import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import CardLayout from "./CardLayout";
import { forwardRef, useEffect, useState, useMemo } from "react";
import { COLORS } from "@/constants/colors";
import { sseAPI } from "@/api/api";

const EocLiveChartCard = forwardRef((props, ref) => {
    const [sseDataList, setSseDataList] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const updateStreamData = (data) => {
        setSseDataList(prev => {
            const updatedList = [...prev, data];
            if (updatedList.length > 50) {
                // 최근 50개만 유지
                return updatedList.slice(-50);
            }
            return updatedList;
        });
    };

    useEffect(() => {
        const disconnect = sseAPI.connect(
            '/sse/stream/eoc',
            (data) => {
                console.log('📡 EOC 데이터 수신:', data);
                updateStreamData(data);
                setIsConnected(true);
            },
            (error) => {
                console.error('❌ EOC SSE 연결 에러:', error);
                setIsConnected(false);
            }
        );

        return () => {
            disconnect();
            setIsConnected(false);
        };
    }, []);

    // 색상 생성 함수
    const getLineColor = (index, total) => {
        const hue = (index * (360 / total)) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    };

    // 동적으로 라인 생성 (EOC 데이터 구조에 따라 수정)
    const dynamicLines = useMemo(() => {
        if (sseDataList.length === 0) return [];

        const firstEntry = sseDataList[0];
        if (firstEntry.value) {
            const keys = Object.keys(firstEntry.value).filter(key => {
                const val = firstEntry.value[key];
                return typeof val === 'number' || (typeof val === 'object' && val !== null);
            });
            
            // value가 객체인 경우 (예: deviceId별 데이터)
            if (keys.length > 0 && typeof firstEntry.value[keys[0]] === 'object') {
                return keys.flatMap((deviceId, idx) => {
                    const idNum = deviceId.replace('deviceId_', '');
                    const deviceData = firstEntry.value[deviceId];
                    
                    return Object.keys(deviceData).map((field, fieldIdx) => ({
                        key: `${deviceId}-${field}`,
                        dataKey: `value.${deviceId}.${field}`,
                        name: `${idNum} ${field}`,
                        stroke: getLineColor(idx * Object.keys(deviceData).length + fieldIdx, keys.length * Object.keys(deviceData).length),
                    }));
                });
            }
            
            // value가 숫자인 경우
            return keys.map((key, idx) => ({
                key: key,
                dataKey: `value.${key}`,
                name: key.toUpperCase(),
                stroke: getLineColor(idx, keys.length),
            }));
        }
        return [];
    }, [sseDataList]);

    return (
        <CardLayout
            {...props}
            title={
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white px-2 py-0.5 font-bold uppercase rounded-[4px]" 
                        style={{ backgroundColor: isConnected ? COLORS.accent1 : '#6B7280' }}>
                        {isConnected ? 'Live' : 'Disconnected'}
                    </span>
                    <span className="font-medium text-[20px]">{props.title || 'EOC'}</span>
                    <span className="text-xs text-gray-500">({sseDataList.length}개)</span>
                </div>
            }
            style={props.style}
            ref={ref}
        >
            <div className='h-full w-full flex items-center justify-center relative'>
                <ResponsiveContainer width="100%">
                    <LineChart data={sseDataList}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="ins_time" 
                            stroke="#9ca3af" 
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => {
                                try {
                                    return new Date(value).toLocaleTimeString('ko-KR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        second: '2-digit' 
                                    });
                                } catch {
                                    return value;
                                }
                            }}
                        />
                        <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
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
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(33, 37, 41, 0.98)', 
                                border: '1px solid #343a40', 
                                borderRadius: '8px',
                                backdropFilter: 'blur(4px)'
                            }}
                            wrapperStyle={{ 
                                zIndex: 1000 
                            }}
                            labelFormatter={(value) => {
                                try {
                                    return new Date(value).toLocaleString('ko-KR');
                                } catch {
                                    return value;
                                }
                            }}
                        />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CardLayout>
    );
});

EocLiveChartCard.displayName = 'EocLiveChartCard';

export default EocLiveChartCard;

