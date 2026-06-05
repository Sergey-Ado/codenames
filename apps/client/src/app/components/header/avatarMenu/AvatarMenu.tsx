import { socket } from '@/app/router/router';
import { changeOpenAvatarMenu, changeUserdata } from '@/app/store/generalSlice';
import { RootState } from '@/app/store/store';
import { Pages, StorageConstants } from '@/types/general.types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

export function AvatarMenu() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const settings = t('avatar-menu.settings');
  const logout = t('avatar-menu.logout');

  const dispatch = useDispatch();
  const openAvatarMenu = useSelector(
    (state: RootState) => state.general.openAvatarMenu
  );

  useEffect(() => {
    const closeMenu = (event: Event) => {
      const target = event.target;

      if (
        target instanceof Element &&
        !(
          target.closest('#avatar-menu') ||
          (openAvatarMenu && target.closest('#avatar'))
        )
      ) {
        dispatch(changeOpenAvatarMenu(false));
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [dispatch, openAvatarMenu]);

  const logoutHandler = () => {
    dispatch(changeOpenAvatarMenu(false));
    dispatch(changeUserdata({ id: '', username: '' }));
    sessionStorage.removeItem(StorageConstants.AUTH_TOKEN);
    socket.disconnect();
    navigate(Pages.LOGIN);
  };

  const settingsItem = (
    <div
      className="flex gap-2 p-2 cursor-pointer hover:bg-hover-light duration-200 dark:hover:bg-hover-dark"
      role="settings-button"
      // onClick={onClick}
    >
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <span>{settings}</span>
    </div>
  );

  const logoutItem = (
    <div
      className="flex gap-2 p-2 cursor-pointer hover:bg-hover-light duration-200 dark:hover:bg-hover-dark"
      onClick={logoutHandler}
      role="avatar-menu-logout">
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
  );

  return (
    <div className="absolute right-5 inset-y-full">
      <div
        className="right-5 inset-y-full p-2 bg-primary-light rounded-xl flex flex-col border dark:bg-primary-dark shadow-[0_0_20px_0_#272727]"
        id="avatar-menu"
        role="avatar-menu">
        {settingsItem}
        {logoutItem}
      </div>
    </div>
  );
}
