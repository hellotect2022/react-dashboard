import { Line, ResponsiveContainer,LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import CardLayout from "./CardLayout";
import { forwardRef, useEffect, useState } from "react";
import { COLORS } from "@/constants/colors";
import { sseAPI } from "@/api/api";



const LiveChartCard = forwardRef((props, ref) => {
    const [sseDataList, setSSeDataList] = useState([])
    const [isConnected, setIsConnected] = useState(false);


    const updateStreamData = (data) => {
        setSSeDataList(prev=>{
            const updatedList = [...prev, data];
            if (updatedList.length > 50) {
                // 뒤에서부터 50개만 남깁니다.
                return updatedList.slice(-50);
            }

            return updatedList;
        })
    }

    const getSseStream = (type) => {
        return sseAPI.connect(
            `/sse/stream/${type}`, 
            (data) => {
                updateStreamData(data)
            },
            (error) => {
                // 에러 발생 시 처리
                console.error('SSE 연결 에러:', error);
                setIsConnected(false);
            }
        );
    }

    useEffect(()=>{
        const disconnect = getSseStream('thd')

        return ()=>{
            disconnect()
            setIsConnected(false)
        }
    },[])

    const data2 = [
        {
            "ins_time": "2025-12-22T14:33:33.007938100",
            "type": "thd",
            "value": {"deviceId_1": {"temp": 23,"humidity": 19.5},"deviceId_5": {"temp": 28,"humidity": 15.2},"deviceId_6": {"temp": 28.6,"humidity": 14},"deviceId_7": {"temp": 20.8,"humidity": 10.9},"deviceId_8": {"temp": 27,"humidity": 14.4},"deviceId_9": {"temp": 32.3,"humidity": 11.2},"deviceId_10": {"temp": 26.3,"humidity": 15},"deviceId_11": {"temp": 27.2,"humidity": 14.6},"deviceId_12": {"temp": 21.5,"humidity": 20.1},"deviceId_13": {"temp": 25.6,"humidity": 16.6},"deviceId_14": {"temp": 26.3,"humidity": 16},"deviceId_15": {"temp": 26.1,"humidity": 16.2},"deviceId_16": {"temp": 27.9,"humidity": 14.8},"deviceId_17": {"temp": 29.1,"humidity": 14},"deviceId_18": {"temp": 31.3,"humidity": 12.7}}
        },
        {
            "ins_time": "2025-12-22T14:33:34.016100",
            "type": "thd",
            "value": {"deviceId_1": {    "temp": 23,    "humidity": 19.5},"deviceId_5": {    "temp": 28,    "humidity": 15.2},"deviceId_6": {    "temp": 28.6,    "humidity": 14},"deviceId_7": {    "temp": 20.8,    "humidity": 10.9},"deviceId_8": {    "temp": 27.1,    "humidity": 14.4},"deviceId_9": {    "temp": 32.3,    "humidity": 11.2},"deviceId_10": {    "temp": 26.3,    "humidity": 15},"deviceId_11": {    "temp": 27.2,    "humidity": 14.6},"deviceId_12": {    "temp": 21.5,    "humidity": 20.1},"deviceId_13": {    "temp": 25.6,    "humidity": 16.6},"deviceId_14": {    "temp": 26.3,    "humidity": 16},"deviceId_15": {    "temp": 26.1,    "humidity": 16.2},"deviceId_16": {    "temp": 27.9,    "humidity": 14.8},"deviceId_17": {    "temp": 29.1,    "humidity": 14},"deviceId_18": {    "temp": 31.3,    "humidity": 12.7}    }
        },
        {
            "ins_time": "2025-12-22T14:33:35.008122400",
            "type": "thd",
            "value": {"deviceId_1": {    "temp": 23,    "humidity": 19.5},"deviceId_5": {    "temp": 28,    "humidity": 15.2},"deviceId_6": {    "temp": 28.6,    "humidity": 14},"deviceId_7": {    "temp": 20.9,    "humidity": 10.9},"deviceId_8": {    "temp": 27,    "humidity": 14.4},"deviceId_9": {    "temp": 32.3,    "humidity": 11.2},"deviceId_10": {    "temp": 26.3,    "humidity": 15},"deviceId_11": {    "temp": 27.2,    "humidity": 14.6},"deviceId_12": {    "temp": 21.5,    "humidity": 20},"deviceId_13": {    "temp": 25.6,    "humidity": 16.6},"deviceId_14": {    "temp": 26.3,    "humidity": 16},"deviceId_15": {    "temp": 26.1,    "humidity": 16.2},"deviceId_16": {    "temp": 27.9,    "humidity": 14.8},"deviceId_17": {    "temp": 29.1,    "humidity": 14},"deviceId_18": {    "temp": 31.3,    "humidity": 12.7}    }
        }
    ]

    // 1. 색상 자동 생성 함수 (Hsl을 쓰면 겹치지 않게 무지개색으로 뽑기 좋습니다)
    const getLineColor = (index, total, isTemp) => {
        const hue = (index * (360 / total)) % 360;
        // 온도는 좀 더 진하게(S: 70%, L: 50%), 습도는 연하게(S: 40%, L: 70%) 구분
        return isTemp ? `hsl(${hue}, 70%, 50%)` : `hsl(${hue}, 40%, 75%)`;
    };

    // 2. 존재하는 모든 장치 ID와 하위 필드(temp, humidity)를 추출하여 변수화
    const dynamicLines = useMemo(() => {
        if (data2.length === 0) return [];

        const firstEntryValue = data2[1]?.value;
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
    }, [data]);
    
    return (
        <CardLayout
            {...props}
            title={
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white px-2 py-0.5 font-bold uppercase rounded-[4px]" 
                        style={{ backgroundColor: COLORS.accent1 }}>
                    Live
                    </span>
                    <span className="font-medium text-[20px]">{props.title}</span>
                </div>
            }
            style={props.style}
            ref={ref} 
        >
            {props.children}
            <div className='h-full w-full flex items-center justify-center relative'>
                <ResponsiveContainer width="100%">
                    <LineChart data={data2}>
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
                    <Tooltip contentStyle={{ backgroundColor: '#212529', border: '1px solid #343a40', borderRadius: '8px' }} />
                    <Legend/>
                    </LineChart>
                    
                </ResponsiveContainer>
            </div>
        </CardLayout>
    );
});


export default LiveChartCard;