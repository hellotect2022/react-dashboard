import { COLORS } from '@/constants/colors';
import React, { forwardRef } from 'react';
import { Cell, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import CardLayout from './CardLayout';


const OperationRateCard = forwardRef(({ data, title,children, style, className, ...props }, ref) => {
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
            title={title}
            style={style}
            ref={ref} 
        >
            {children}
            <div className='h-full w-full flex items-center justify-center relative'>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={92}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={12}
                        >
                            <Cell fill="url(#colorHealthy)" />
                            <Cell fill="#2C3136" />
                        </Pie>
                        <defs>
                            <linearGradient id="colorHealthy" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={1}/>
                            <stop offset="100%" stopColor={COLORS.success} stopOpacity={1}/>
                            </linearGradient>
                        </defs>
                    </PieChart>
                </ResponsiveContainer>

                {/*  그래프 가운데 텍스트 표시 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-2">
                    <div className="text-[52px] font-bold flex items-baseline leading-none" style={{ color: COLORS.primary }}>
                        {rawValue} <span className="text-[28px] ml-1 font-medium">%</span>
                    </div>
                    <div className="text-[14px] text-gray-400 font-medium tracking-wide mt-2">Healthy</div>
                </div>
            </div>
        </CardLayout>
    );
});


export default OperationRateCard;