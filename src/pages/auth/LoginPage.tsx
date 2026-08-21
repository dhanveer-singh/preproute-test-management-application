import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/images/logo.svg';
import loginIllustration from '@/assets/images/login-illustration.svg';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { loginSchema, type LoginFormData } from '@/types/auth';
import { setToken } from '@/utils/storage';
import { showSuccess } from '@/utils/toast';
import { login } from '@/services/authApi';

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);

      setToken(response.data.token);

      showSuccess(response.message);

      navigate('/dashboard', { replace: true });
    } catch {
      // Common API errors are handled by api.ts.
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-[20px] py-[18px]">
      <div className="flex min-h-[calc(100vh-36px)] w-full items-center overflow-hidden rounded-xl">
        <section className="hidden flex-1 items-center justify-center lg:flex">
          <img
            src={loginIllustration}
            alt="Preproute login illustration"
            className="w-[70%] max-w-[520px] object-contain"
          />
        </section>

        <section className="flex w-full justify-center lg:w-1/2">
          <div className="min-h-[calc(100vh-36px)] w-full max-w-177.5 rounded-lg border border-[#9CC5FF] bg-white px-8 py-12 sm:px-12 lg:px-24.75">
            <div className="flex h-full flex-col justify-center rounded-lg">
              <img src={logo} alt="Preproute" className="mb-7.5 h-auto w-35 object-contain" />

              <div className="mb-7.5">
                <h1 className="text-[20px] font-semibold leading-7 text-[#344054]">Login</h1>

                <p className="mt-5 text-[13px] leading-5 text-[#475467]">
                  Use your company provided Login credentials
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Input
                  id="userId"
                  label="User ID"
                  placeholder="Enter User ID"
                  autoComplete="username"
                  {...register('userId')}
                  error={errors.userId?.message}
                />

                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  {...register('password')}
                  error={errors.password?.message}
                />

                <button
                  type="button"
                  className="-mt-3 text-left text-[14px] font-medium text-[#2563EB] hover:underline"
                >
                  Forgot password?
                </button>

                <Button type="submit">Login</Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
