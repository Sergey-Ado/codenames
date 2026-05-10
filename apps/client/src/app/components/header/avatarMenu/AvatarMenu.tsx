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
    sessionStorage.removeItem(StorageConstants.USER_ID);
    sessionStorage.removeItem(StorageConstants.USERNAME);
    navigate(Pages.LOGIN);
  };

  return (
    <div className="absolute right-5 inset-y-full">
      <div
        className="right-5 inset-y-full p-2 bg-primary-light rounded-xl flex flex-col border dark:bg-primary-dark shadow-[0_0_20px_0_#272727]"
        id="avatar-menu"
        role="avatar-menu">
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
      </div>
    </div>
  );
}
