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
    <div className="switch-base">
      <div className="ml-2.5 cursor-pointer" onClick={handleLangChange}>
        en
      </div>
      <div className="ml-2.5 cursor-pointer" onClick={handleLangChange}>
        ru
      </div>
      <div
        className={`switch-circle ${lang === 'en' ? 'left-1' : 'left-10'}`}></div>
    </div>
  );
}
