import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LangSwitch() {
  const [lang, setLang] = useState(i18next.language);

  const { i18n } = useTranslation();

  const handleLangChange = () => {
    const newLang = lang === 'en' ? 'ru' : 'en';
    i18next.changeLanguage(newLang).catch(() => {});
    setLang(newLang);
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <div className="bg-blue-600 w-20 h-11 rounded-full flex items-center text-xl text-white relative border-2">
      <div className="ml-2.5 cursor-pointer" onClick={handleLangChange}>
        en
      </div>
      <div className="ml-2.5 cursor-pointer" onClick={handleLangChange}>
        ru
      </div>
      <div
        className={`bg-white w-8 h-8 rounded-full absolute left-${lang === 'en' ? 1 : 10} cursor-auto duration-200`}></div>
    </div>
  );
}
