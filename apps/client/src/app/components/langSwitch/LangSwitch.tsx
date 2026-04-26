import i18next from 'i18next';
import { useState } from 'react';

export function LangSwitch() {
  const [lang, setLang] = useState(i18next.language);

  const handleLangChange = () => {
    const newLang = lang === 'en' ? 'ru' : 'en';
    i18next.changeLanguage(newLang).catch(() => {});
    setLang(newLang);
  };

  return (
    <div className="bg-blue-200 dark:bg-amber-950 w-20 h-11 rounded-full flex items-center text-xl dark:text-white relative border">
      <div className="ml-2.5 cursor-pointer" onClick={handleLangChange}>
        en
      </div>
      <div className="ml-2.5 cursor-pointer" onClick={handleLangChange}>
        ru
      </div>
      <div
        className={`bg-white dark:bg-amber-700 w-8 h-8 rounded-full absolute left-${lang === 'en' ? '1' : '10'} cursor-auto duration-200 border`}></div>
    </div>
  );
}
