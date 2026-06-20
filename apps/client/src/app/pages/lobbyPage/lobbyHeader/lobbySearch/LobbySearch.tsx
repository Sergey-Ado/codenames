import { TypedSocket } from '@/types/general.types';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  socket: TypedSocket;
}

export function LobbySearch({ socket }: props) {
  const [value, setValue] = useState('');

  const onCrossClick = () => {
    setValue('');
    socket.emit('lobby:search-rooms', { key: '' });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
  };

  const onSearchClick = () => {
    if (value.trim()) {
      socket.emit('lobby:search-rooms', { key: value.trim() });
    }
  };

  const { t } = useTranslation();

  const search = t('lobby.search');

  const cross = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      role="search-cross"
      className="-ml-11 h-full pl-1 pr-1 ph-0 w-8 cursor-pointer"
      onClick={onCrossClick}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className="flex items-center gap-2.5 justify-end grow sm:gap-3">
      <input
        role="search-input"
        type="text"
        className="input h-9 w-48 sm:w-53.5"
        value={value}
        onChange={onChange}
      />
      {cross}
      <button
        role="search-button"
        className="button px-2 py-1"
        onClick={onSearchClick}>
        {search}
      </button>
    </div>
  );
}
