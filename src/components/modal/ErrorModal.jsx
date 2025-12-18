import Modal from './Modal';

/**
 * 로그인 실패 에러 Modal 컴포넌트
 */
export default function ErrorModal({ isOpen, onClose, errorMessage }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null} backGroundColor={'bg-black/75'}>
      <div className="text-center py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">시스템 로그인 실패</h2>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center text-red-600">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">
                {errorMessage || '에러 메시지 영역'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded-md transition duration-200"
          >
            확인
          </button>
        </div>

        {/* MPOLE 로고 */}
        <div className="flex justify-center">
          <div className="text-pink-500 font-bold text-xl">
            <span className="text-2xl">M</span>POLE
          </div>
        </div>
      </div>
    </Modal>
  );
}

