import { COLORS } from '@/constants/colors';
import React, { forwardRef } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CardLayout from './CardLayout';


const AnomalySummaryCard = forwardRef((props,ref) => {
    const data1 = [
        { name: 'Vibration', value: 12, count: 8, color: '#14B8A6' },
        { name: 'Thermal', value: 8, count: 8, color: '#F97316' },
        { name: 'Temp & Humid', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
        { name: 'a', value: 5, count: 6, color: '#06B6D4' },
    ];

    const RightLabel = (props) => {
        const { x, y, width, height, count } = props;
        return (
            <text x={x + width + 10} y={y + height / 2} fill="#14B8A6" textAnchor="start" dominantBaseline="middle" fontSize="14" fontWeight="500">
            {count}
            </text>
        );
    };

    // 왼쪽 숫자 표시용 커스텀 Label
    const LeftLabel = (props) => {
        const { x, y, height, value } = props;
        return (
            <text x={x - 10} y={y + height / 2} fill="#fff" textAnchor="end" dominantBaseline="middle" fontSize="14" fontWeight="500">
                {value}
            </text>
        );
    };

    // 커스텀 Legend 렌더러
    const renderLegend = (props) => {
        return (
            <div className="flex gap-4 justify-center overflow-x-hidden">
                {data1.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 shrink-0">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                        <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                ))}
            </div>
        );
    };
    
    return (
        <CardLayout 
            {...props}
            title={props.title}
            style={props.style}
            ref={ref} 
        >
            {props.children}
            <div className='h-full w-full flex flex-col items-center justify-center relative'>
                <ResponsiveContainer width="100%" >
                <BarChart data={data1} layout="vertical" margin={{ left: 30, right: 50 }}>
                    <XAxis type="number" hide/>
                    <YAxis type="category" dataKey="name" hide />
                    <Bar dataKey="value" radius={10} barSize={5} label={<LeftLabel />}>
                        {data1.map((entry, index) => {
                            console.log("???",entry,index)
                            return (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        )})}
                    </Bar>
                    {/* <Bar dataKey="value"  radius={10} fill="transparent" label={(props) => <RightLabel {...props} count={data1[props.index].count} />} /> */}
                    <Tooltip />
                    <Legend content={renderLegend}/>    
                </BarChart>
                </ResponsiveContainer>
            </div>
        </CardLayout>
        
    );
});


export default AnomalySummaryCard;