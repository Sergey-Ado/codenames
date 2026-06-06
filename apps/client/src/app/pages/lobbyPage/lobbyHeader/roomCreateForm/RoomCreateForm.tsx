import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface props {
  callback: () => void;
}

const onGenerate = () => console.log('generate room name');
const onSubmit = () => console.log('submit room data');

export function RoomCreateForm({ callback }: props) {
  const { t } = useTranslation();

  const title = t('lobby.form.title');
  const nameTitle = t('lobby.form.name.title');
  const namePlaceholder = t('lobby.form.name.placeholder');
  const nameGenerate = t('lobby.form.name.generate');
  const typeTitle = t('lobby.form.type.title');
  const typeFirst = t('lobby.form.type.first');
  const typeSecond = t('lobby.form.type.second');
  const typeThird = t('lobby.form.type.third');
  const submit = t('lobby.form.submit');

  const optionData = [
    { value: 4, label: typeFirst },
    { value: 6, label: typeSecond },
    { value: 8, label: typeThird },
  ];

  const options = optionData.map(data => (
    <option value={data.value} key={data.value}>
      {data.label}
    </option>
  ));

  const cross = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      role="settings-close"
      className="size-8 absolute right-2 top-2 hover:cursor-pointer hover:bg-hover-light dark:hover:bg-hover-dark rounded-2xl p-1 duration-200"
      onClick={callback}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 size-full',
        'bg-[#00000034] backdrop-blur-[2px]',
        'flex justify-center items-center'
      )}>
      <div
        role="room-create-form"
        className={clsx(
          'dark:bg-secondary-dark border rounded-lg bg-blue-50',
          'relative p-5 w-72',
          'flex flex-col items-center gap-3'
        )}>
        <h2 className="text-xl mb-2">{title}</h2>
        <div className="self-stretch flex flex-col gap-1">
          <span className="self-start">{nameTitle}</span>
          <input
            type="text"
            className={clsx(
              'bg-primary-light dark:bg-primary-dark',
              'border px-2 py-1 self-stretch rounded-lg focus:outline-none'
            )}
            placeholder={namePlaceholder}
          />
          <button className="button px-2 py-1 self-end" onClick={onGenerate}>
            {nameGenerate}
          </button>
        </div>
        <div className="self-stretch flex flex-col gap-1 pb-3 border-b">
          <span>{typeTitle}</span>
          <select
            name=""
            id=""
            className={clsx(
              'bg-primary-light border dark:bg-primary-dark',
              'px-2 py-1 focus:outline-none rounded-lg'
            )}>
            {options}
          </select>
        </div>
        <button className="button px-2 py-1 self-end" onClick={onSubmit}>
          {submit}
        </button>
        {cross}
      </div>
    </div>
  );
}
