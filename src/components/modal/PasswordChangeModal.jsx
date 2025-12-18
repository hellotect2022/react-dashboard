import { useState } from 'react';
import Modal from './Modal';

/**
 * 비밀번호 변경 Modal 컴포넌트
 */
export default function PasswordChangeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    userLoginId: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userLoginId.trim()) {
      newErrors.userLoginId = 'id 를 입력해주세요.';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (formData.newPassword.length < 4) {
      newErrors.newPassword = '비밀번호는 최소 4자 이상이어야 합니다.';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      userLoginId: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">비밀번호 변경</h2>
        <p className="text-sm text-gray-600">
          디지털트윈 통합관제시스템 비밀번호를 변경하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* userLoginId 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            아이디
          </label>
          <input
            type="text"
            name="userLoginId"
            value={formData.userLoginId}
            onChange={handleChange}
            placeholder="admin"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.userLoginId && (
            <p className="mt-1 text-sm text-red-600">{errors.userLoginId}</p>
          )}
        </div>

        {/* 새 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 PW
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="****"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        {/* 새 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 PW 확인
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="****"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 비밀번호 변경 버튼 */}
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-md transition duration-200"
        >
          비밀번호 변경
        </button>
      </form>

      {/* MPOLE 로고 */}
      <div className="mt-6 flex justify-center">
        <div className="text-pink-500 font-bold text-xl">
          <span className="text-2xl">M</span>POLE
        </div>
      </div>
    </Modal>
  );
}


