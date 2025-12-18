import React, { forwardRef } from 'react';

const CardLayout = forwardRef(({ title, children, style, className, onMouseDown, onMouseUp, onTouchEnd, ...props }, ref) => {
    return (
        <div
            ref={ref} // 중요: react-grid-layout이 이 div의 위치를 계산할 수 있게 합니다.
            style={style} // 중요: 라이브러리가 주는 x, y 좌표 및 w, h 크기 스타일입니다.
            className={`${className} flex flex-col bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-4 relative`}
            onMouseDown={onMouseDown} // 중요: 드래그 시작을 감지합니다.
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
            {...props} // 기타 필요한 속성 전달
        >
            {/* Title */}
            <div className="flex items-center border-l-4 border-sky-400 pl-3 mb-2">
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