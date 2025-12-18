import { useEffect } from 'react';

/**
 * 공통 Modal 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 모달 제목
 * @param {ReactNode} children - 모달 내용
 */
export default function Modal({ isOpen, onClose, title, children, backGroundColor='bg-black/50' }) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className={`fixed inset-0 ${backGroundColor}`}
        onClick={onClose}
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        
        <div className="text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}


