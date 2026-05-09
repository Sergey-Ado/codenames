import { useTranslation } from 'react-i18next';
import { LangSwitch } from '../header/langSwitch/LangSwitch';
import { ThemeSwitch } from '../header/themeSwitch/ThemeSwitch';
import { useDispatch } from 'react-redux';
import { changeOpenSettings } from '@/app/store/generalSlice';

export function SettingsModal() {
  const { t } = useTranslation();

  const title = t('settings-modal.title');
  const theme = t('settings-modal.theme');
  const lang = t('settings-modal.language');

  const dispatch = useDispatch();

  const onCloseHandler = () => {
    dispatch(changeOpenSettings(false));
  };

  return (
    <div className="absolute bg-[#00000034] backdrop-blur-[2px] size-full flex justify-center items-center">
      <div
        className="bg-primary-light dark:bg-secondary-dark p-5 relative flex flex-col items-end gap-5 rounded-lg capitalize w-60 border"
        role="settings-modal">
        <span className="self-center mb-3 text-3xl">{title}</span>
        <div className="flex items-center gap-5">
          <span>{theme}</span>
          <ThemeSwitch />
        </div>
        <div className="flex items-center gap-5">
          <span>{lang}</span>
          <LangSwitch />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          role="settings-close"
          className="size-8 absolute right-2 top-2 hover:cursor-pointer hover:bg-hover-light dark:hover:bg-hover-dark rounded-2xl p-1 duration-200"
          onClick={onCloseHandler}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}
