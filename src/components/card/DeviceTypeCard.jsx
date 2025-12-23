import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import CardLayout from "./CardLayout";
import { forwardRef } from "react";

const DeviceTypeCard = forwardRef((props, ref) => {
    const data = [
        { name: '열화상', value: 6, color: '#0047FF' },
        { name: '온습도', value: 5, color: '#00A344' },
        { name: '진동계', value: 4, color: '#F5851F' },
    ];
    return (
        <CardLayout 
            {...props}
            title={props.title}
            style={props.style}
            ref={ref} 
        >
            {props.children}
            <div className='h-full w-full flex'>
                <div className="flex items-center justify-between w-full h-full px-2">
                    {/* Left Legend Section */}
                    <div className="flex flex-col gap-6 pl-4">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center">
                            <span 
                                className="w-3 h-3 rounded-full mr-4" 
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-[16px] text-[#A0A0A0] font-medium w-16">
                                {item.name}
                            </span>
                            <div className="flex items-baseline ml-6">
                                <span className="text-[20px] text-white font-bold mr-1">
                                {item.value}
                                </span>
                                <span className="text-[16px] text-[#606060] font-medium">
                                개
                                </span>
                            </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Chart Section */}
                    <div className="relative w-[180px] h-[180px] mr-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={62}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="flex items-baseline mt-1">
                                <span className="text-[36px] font-bold text-white leading-none tracking-tight">
                                    15
                                </span>
                                <span className="text-[18px] ml-1.5 font-medium text-[#A0A0A0]">
                                    개
                                </span>
                            </div>
                            <div className="text-[14px] text-[#606060] font-medium mt-0.5">
                                Total
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
        </CardLayout>
    );
});


export default DeviceTypeCard;