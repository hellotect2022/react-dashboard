import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import CardLayout from "./CardLayout";
import { forwardRef, useEffect, useState, useMemo } from "react";
import { COLORS } from "@/constants/colors";
import { sseAPI } from "@/api/api";

const GemsLiveChartCard = forwardRef(({ feederId, title, sseDataList, isConnected, ...props }, ref) => {
    // props로 받은 데이터 사용 (SSE 연결 제거)

    // 색상 매핑 (전력계 데이터 필드별)
    const fieldColors = {
        voltage: '#3B82F6',      // 파란색 - 전압
        current: '#EF4444',      // 빨간색 - 전류
        power: '#10B981',        // 초록색 - 전력
        frequency: '#F59E0B',    // 주황색 - 주파수
        powerFactor: '#8B5CF6', // 보라색 - 역률
    };

    // 특정 feeder의 데이터만 필터링 & 동적 라인 생성
    const { filteredData, dynamicLines } = useMemo(() => {
        //console.log('🔍 sseDataList:', sseDataList);
        //console.log('🔍 feederId:', feederId);
        
        if (sseDataList.length === 0) {
            //console.log('⚠️ sseDataList가 비어있음');
            return { filteredData: [], dynamicLines: [] };
        }

        // 첫 번째 데이터 구조 확인
        //console.log('🔍 첫 번째 데이터 구조:', sseDataList[0]);

        // feeder별로 데이터 필터링
        const filtered = sseDataList.map(item => {
            //console.log("???",item)
            if (item.value?.totalData?.feederNumber == feederId) {
                return {
                    //...item,
                    ins_time :item.ins_time,
                    feederData: item.value.totalData
                };
            }
            return null;
        }).filter(Boolean);

        //console.log('🔍 생성된 데이타:', filtered);

        // //console.log('🔍 필터링된 데이터:', filtered);

        if (filtered.length === 0) {
            return { filteredData: [], dynamicLines: [] };
        }

        // 첫 번째 데이터에서 필드 추출
        const firstFeederData = filtered[0].feederData;
        //console.log('🔍 첫 번째 feeder 데이터:', firstFeederData);
        
        const fields = Object.keys(firstFeederData).filter(key => 
            key !== 'feederNumber' && typeof firstFeederData[key] === 'number'
        );
        //console.log('🔍 필드 목록:', fields);

        const lines = fields.map((field, idx) => ({
            key: field,
            dataKey: `feederData.${field}`,
            name: field.charAt(0).toUpperCase() + field.slice(1),
            stroke: fieldColors[field] || `hsl(${idx * 60}, 70%, 50%)`,
        }));

        
        //console.log('🔍 생성된 라인:', lines);

        return { filteredData: filtered, dynamicLines: lines };
    }, [sseDataList]);

    // 최신 값 표시
    const latestValue = useMemo(() => {
        if (filteredData.length === 0) return null;
        return filteredData[filteredData.length - 1].feederData;
    }, [filteredData]);

    return (
        <CardLayout
            {...props}
            title={
                <div className="drag-handle flex items-center gap-3 cursor-move">
                    <span className="text-[11px] text-white px-2 py-0.5 font-bold uppercase rounded-[4px]" 
                        style={{ backgroundColor: isConnected ? COLORS.accent1 : '#6B7280' }}>
                        {isConnected ? 'Live' : 'Off'}
                    </span>
                    <span className="font-medium text-[20px]">{title || `Feeder ${feederId}`}</span>
                </div>
            }
            style={props.style}
            ref={ref}
        >
            <div className='h-full w-full flex flex-col'>
                {props.children}
                {/* 최신 값 표시 */}
                {latestValue && (
                    <div className="flex gap-4 mb-6 px-2 overflow-x-auto scrollbar-hide">
                        {Object.entries(latestValue).map(([key, value]) => (
                            <div key={key} className="flex flex-col items-center shrink-0">
                                <span className="text-xs text-gray-400">{key}</span>
                                <span className="text-sm font-bold" style={{ color: fieldColors[key] || '#fff' }}>
                                    {typeof value === 'number' ? value.toFixed(2) : value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* 그래프 */}
                <div className='flex-1 flex items-center justify-center relative'>
                    <ResponsiveContainer width="100%">
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            {/* 0 기준선 추가 */}
                            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
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
                            <YAxis 
                                stroke="#9ca3af" 
                                tick={{ fontSize: 10 }}
                                domain={[-10, 'dataMax']}
                                allowDataOverflow={true}
                            />
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
                            {/* <Legend /> */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </CardLayout>
    );
});

GemsLiveChartCard.displayName = 'GemsLiveChartCard';

export default GemsLiveChartCard;

