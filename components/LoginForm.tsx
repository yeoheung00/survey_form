// components/LoginForm.tsx

'use client'; // 클라이언트 컴포넌트임을 명시

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 🚨 중요: 입력된 id와 pw를 JSON 형식으로 API에 전송
        body: JSON.stringify({ id, pw }), 
      });

      const data = await response.json();

      if (response.ok) {
        // 200 OK: 로그인 성공
        setMessage('로그인 성공! 관리자 페이지로 이동합니다.');
        // TODO: 실제로는 JWT/세션 정보를 저장해야 함
        // router.push('/admin/dashboard'); // 성공 시 대시보드로 이동
        console.log("로그인성공했음")
      } else {
        // 401 Unauthorized 등 실패
        setMessage(data.message || '로그인 실패: 알 수 없는 오류');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      setMessage('네트워크 오류 또는 서버 접속 실패.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID (Username)
          </label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="pw" className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            id="pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      {message && <p className={`mt-4 text-center ${message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}