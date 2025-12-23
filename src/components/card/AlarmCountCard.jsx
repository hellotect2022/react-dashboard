import { COLORS } from '@/constants/colors';
import React, { forwardRef } from 'react';
import { Cell, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import CardLayout from './CardLayout';
import { Bell } from 'lucide-react';


const AlarmCountCard = forwardRef((props,ref) => {
    const errorColor = '#FC185A'
    const data = [
        {name: 'a', value:95}
    ]
    const rawValue = data?.[0]?.value ?? 0;
    
    // 2. 클라이언트에서만 렌더링용으로 데이터 쪼개기 (100 기준)
    // index 0은 실제 값, index 1은 나머지 회색 배경이 됩니다.
    const chartData = [
        { value: rawValue }, 
        { value: Math.max(0, 100 - rawValue) } 
    ];
    return (
        <CardLayout
            {...props}
            title={props.title}
            style={props.style}
            ref={ref} 
        >
            {props.children}
            <div className='h-full w-full flex items-center justify-between px-[22px]'>
            
                <div className="flex flex-col gap-6 pl-4">
                    <div className="flex flex-col justify-center items-start">
                        <div className="flex items-baseline">
                            <span className="text-[52px] font-bold leading-none" style={{ color: errorColor }}>
                            {data[0]?.value}
                            </span>
                            <span className="text-[24px] font-medium text-white ml-2 opacity-90">건</span>
                        </div>
                        <div className="text-[16px] text-white opacity-80 mt-4 font-normal">
                            Last 24 Hour
                        </div>
                    </div>
                </div>
                <div className="relative w-[180px] h-[180px] mr-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={72}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={12}
                            >
                                <Cell fill={errorColor} />
                                <Cell fill="#2C3136" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/*  그래프 가운데 텍스트 표시 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-2">
                        <Bell size={35} strokeWidth={1.5} className="text-white" />
                    </div>

                </div>
            </div>

        </CardLayout>
    );
});


export default AlarmCountCard;