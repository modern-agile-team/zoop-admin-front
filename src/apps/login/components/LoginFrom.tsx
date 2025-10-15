import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authQueries } from '@/shared/service/query/auth';
import { STORAGE } from '@/shared/utils/storage';

const authSchema = z.object({
  username: z
    .string()
    .min(1, '사용자명을 입력해주세요.')
    .min(3, '사용자명은 3자 이상이어야 합니다.')
    .trim(),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/(auth)/login/' });

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutateAsync: signIn } = useMutation(authQueries.signIn);

  const handleSubmit = async (data: AuthFormData) => {
    try {
      const result = await signIn(data);
      STORAGE.setAuthToken(result.accessToken);

      navigate({ href: searchParams.redirectUrl });
    } catch (error) {
      if (error === 'AUTH.SIGN_IN_INFO_NOT_MATCHED') {
        form.setError('password', {
          message: '사용자명 또는 비밀번호가 올바르지 않습니다.',
        });
      } else {
        form.setError('root', {
          message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md min-w-[450px]">
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-2xl font-bold mb-5">
        Quiz Game ADMIN
      </h2>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-3">
        <div className="flex flex-col mb-4">
          <label htmlFor="username">사용자 명</label>
          <input
            className="border-1 rounded-lg p-2"
            type="text"
            id="username"
            {...form.register('username')}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-red-500">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password">비밀번호</label>
          <input
            className="border-1 rounded-lg p-2"
            type="password"
            id="password"
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        {form.formState.errors.root && (
          <p className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white rounded-lg p-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
