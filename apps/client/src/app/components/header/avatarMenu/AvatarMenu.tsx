import { useTranslation } from 'react-i18next';

export function AvatarMenu() {
  const { t } = useTranslation();

  const logout = t('avatar-menu.logout');

  return (
    <div className="absolute right-5 inset-y-full">
      <div className="right-5 inset-y-full p-2 bg-primary-light rounded-xl flex flex-col border dark:bg-primary-dark">
        <div className="flex gap-2 p-2 cursor-pointer hover:bg-hover-light duration-200 dark:hover:bg-hover-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span>{logout}</span>
        </div>
      </div>
    </div>
  );
}
