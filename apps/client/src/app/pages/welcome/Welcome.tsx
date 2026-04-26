import { useTranslation } from 'react-i18next';

function onLoginClick() {
  console.log('login');
}

function onRegisterClick() {
  console.log('register');
}

export function Welcome() {
  const { t } = useTranslation();

  const welcome = t('welcome.welcome');
  const inGame = t('welcome.in-game');
  const desc = t('welcome.desc');
  const login = t('welcome.login');
  const register = t('welcome.register');

  return (
    <main className="grow flex justify-center items-center">
      <div className="container flex flex-col gap-4 items-center max-w-160  py-8 px-8 mx-8 max-[360px]:px-8 max-[360px]:mx-4">
        <h2 className="max-[450px]:text-2xl text-3xl capitalize">{welcome}</h2>
        <span>{inGame}</span>
        <h1 className="uppercase max-[450px]:text-4xl text-5xl font-perm text-blue-600 dark:text-amber-300 max-[450px]:my-1 my-4 text-shadow-[4px_4px_rgb(0,0,0)]">
          codenames
        </h1>
        <p className="text-center">{desc}</p>
        <div className="flex gap-4 mt-6 text-black">
          <button
            type="button"
            className="button py-2 px-4"
            onClick={onLoginClick}>
            {login}
          </button>
          <button
            type="button"
            className="button py-2 px-4"
            onClick={onRegisterClick}>
            {register}
          </button>
        </div>
      </div>
    </main>
  );
}
