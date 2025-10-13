import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { authQueries } from '@/shared/service/query/auth';

export default function LoginForm() {
  const navigate = useNavigate();
  const form = useForm();

  const { mutateAsync: signIn } = useMutation(authQueries.signIn);

  const handleSubmit = () => {
    navigate({ to: '/quizzes' });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md min-w-[450px]">
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-2xl font-bold mb-5">
        Quiz Game ADMIN
      </h2>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-3">
        <div className="flex flex-col mb-4">
          <label htmlFor="nickname">사용자 명</label>
          <input
            className="border-1 rounded-lg p-2"
            type="text"
            id="nickname"
            name="nickname"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password">비밀번호</label>
          <input
            className="border-1 rounded-lg p-2"
            type="password"
            id="password"
            name="password"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white rounded-lg p-2 w-full"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
