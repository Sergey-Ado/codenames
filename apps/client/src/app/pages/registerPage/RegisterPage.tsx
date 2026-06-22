import { useForm } from 'react-hook-form';
import { RegisterInput } from '@repo/shared/user';

import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RegisterInputSchema,
  UserOutputSchema,
} from '@repo/shared/user-schema';
import { Link, useNavigate } from 'react-router';
import { Pages, StorageConstants } from '@/types/general.types';
import { getServerUrl } from '@/utils/getServerUrl';
import { Endpoints, HttpStatus } from '@repo/shared/api';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { changeShowSpinner, changeUserdata } from '@/app/store/generalSlice';
import { useState } from 'react';
import store from '@/app/store/store';

const serverUrl = getServerUrl();

export function RegisterPage() {
  const [canSubmit, setCanSubmit] = useState(true);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterInputSchema),
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t('register.title');
  const email = t('register.email');
  const username = t('register.username');
  const password = t('register.password');
  const submit = t('register.button');
  const registerDesc = t('register.login.desc');
  const registerLink = t('register.login.link');
  const conflict = t('register.error.conflict');

  const onSubmit = async (data: RegisterInput) => {
    if (!canSubmit) return;
    setCanSubmit(false);

    const body = JSON.stringify(data);
    const response = await fetch(`${serverUrl}${Endpoints.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    });
    if (response.ok) {
      try {
        const userdata = UserOutputSchema.safeParse(await response.json());
        const token = response.headers.get('auth-token');
        if (token && userdata.data) {
          const { id, username } = userdata.data;
          sessionStorage.setItem(StorageConstants.AUTH_TOKEN, token);
          store.dispatch(changeUserdata({ id, username }));
        }
        dispatch(changeShowSpinner(true));
        navigate(`/${Pages.LOBBY}`);
      } catch {
        toast.error('Error data');
        setCanSubmit(true);
      }
    } else {
      if (response.status === Number(HttpStatus.CONFLICT)) {
        toast.error(conflict);
        setCanSubmit(true);
      }
    }
  };

  return (
    <main className="grow flex justify-center items-center">
      <form
        className="visual-panel flex flex-col p-4 gap-4 w-xs max-[330px]:w-72"
        onSubmit={handleSubmit(onSubmit)}>
        <h2 className="capitalize self-center font-bold text-xl">{title}</h2>
        <div className="flex flex-col">
          <label className="mb-2">{email}</label>
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
          <label className="mb-2">{username}</label>
          <input
            type="text"
            className="input"
            role="input-username"
            {...register('username')}
          />
          {errors?.username?.message && (
            <p role="username-error">{t(errors.username.message)}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-2">{password}</label>
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
          <span>{registerDesc}</span>
          <Link
            to={`/${Pages.LOGIN}`}
            className="hover:text-third-light dark:hover:text-hover-dark can-dur:duration-300 underline"
            role="login-link">
            {registerLink}
          </Link>
        </div>
      </form>
    </main>
  );
}
