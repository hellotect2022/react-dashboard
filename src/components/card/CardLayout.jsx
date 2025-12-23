import { COLORS } from '@/constants/colors';
import React, { forwardRef } from 'react';

const CardLayout = forwardRef(({ title, children, style, className, onMouseDown, onMouseUp, onTouchEnd, ...props }, ref) => {
    return (
        <div
            style={{backgroundColor: COLORS.cardBg, ...style}}
            className={`${className} flex flex-col bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative`}
            ref={ref}
            {...props}
        >
            {/* Title - drag-handle 클래스 + 이벤트 핸들러 */}
            <div 
                className="drag-handle flex items-center border-l-4 border-sky-400 pl-3 mb-2 cursor-move"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchEnd={onTouchEnd}
            >
              
                <span className="text-white font-bold text-md">{title}</span>
                
            </div>

            {/* Content 영역: flex-1을 주어 타이틀 제외 남은 공간을 꽉 채웁니다 */}
            <div className="flex-1 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
});

// 디버깅 시 컴포넌트 이름을 확인하기 위해 설정
CardLayout.displayName = 'CardLayout';

export default CardLayout;