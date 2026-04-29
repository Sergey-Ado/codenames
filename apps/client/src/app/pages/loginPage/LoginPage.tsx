import { useForm } from 'react-hook-form';
import { LoginInput } from '@repo/shared/src/types/user';

import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInputSchema } from '@repo/shared/src/schemas/user';

const onSubmit = (data: LoginInput) => {
  console.log(data);
};

const onToRegister = () => {
  console.log('to register');
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
  });

  const { t } = useTranslation();

  const title = t('login.title');
  const email = t('login.email');
  const password = t('login.password');
  const submit = t('login.button');
  const registerLink = t('login.register.link');
  const registerDesc = t('login.register.desc');

  return (
    <main className="grow flex justify-center items-center">
      <form
        className="container flex flex-col p-4 gap-4 w-xs max-[330px]:w-76"
        onSubmit={handleSubmit(onSubmit)}>
        <h2 className="capitalize self-center font-bold text-xl">{title}</h2>
        <div className="flex flex-col">
          <label className="capitalize mb-2">{email}</label>
          <input
            type="text"
            className="input"
            role="input-email"
            {...register('email')}
          />
          {errors?.email?.message && (
            <p role="email-error">{t(errors.email.message)}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="capitalize mb-2">{password}</label>
          <input
            type="password"
            className="input"
            role="input-password"
            {...register('password')}
          />
          {errors?.password?.message && (
            <p role="password-error">{t(errors.password.message)}</p>
          )}
        </div>
        <button type="submit" className="button self-center py-2 px-4">
          {submit}
        </button>
        <div className="text-center">
          <span
            className="hover:text-third-light dark:hover:text-hover-dark can-dur:duration-300 underline"
            onClick={onToRegister}
            role="register-link">
            {registerLink}
          </span>
          <span>{registerDesc}</span>
        </div>
      </form>
    </main>
  );
}
