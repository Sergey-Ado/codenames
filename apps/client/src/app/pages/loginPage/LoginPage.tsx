// import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';

export function LoginPage() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const { t } = useTranslation();

  const title = t('login.title');
  const email = t('login.email');
  const password = t('login.password');
  const submit = t('login.button');

  return (
    <main className="grow flex justify-center items-center">
      <form className="container flex flex-col p-4 gap-4">
        <h2 className="capitalize self-center">{title}</h2>
        <div className="flex flex-col">
          <label className="capitalize">{email}</label>
          <input type="text" className="bg-white" />
        </div>
        <div className="flex flex-col">
          <label className="capitalize">{password}</label>
          <input type="text" className="bg-white" />
        </div>
        <button type="button" className="button self-center py-2 px-4">
          {submit}
        </button>
      </form>
    </main>
  );
}
