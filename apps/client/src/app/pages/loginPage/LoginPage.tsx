import { useForm } from 'react-hook-form';
import { LoginInput } from '@repo/shared/src/types/user';

import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInputSchema } from '@repo/shared/src/schemas/user';

const onSubmit = (data: LoginInput) => {
  console.log(data);
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

  return (
    <main className="grow flex justify-center items-center">
      <form
        className="container flex flex-col p-4 gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <h2 className="capitalize self-center">{title}</h2>
        <div className="flex flex-col">
          <label className="capitalize">{email}</label>
          <input
            type="text"
            className="bg-white text-black"
            {...register('email')}
          />
          {errors?.email?.message && <p>{errors.email.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="capitalize">{password}</label>
          <input
            type="password"
            className="bg-white text-black"
            {...register('password')}
          />
          {errors?.password?.message && <p>{errors.password.message}</p>}
        </div>
        <button type="submit" className="button self-center py-2 px-4">
          {submit}
        </button>
      </form>
    </main>
  );
}
