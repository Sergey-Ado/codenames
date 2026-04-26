import { JSX } from 'react';
import { LangSwitch } from '../../../app2/components/langSwitch/LangSwitch';
import { ThemeSwitch } from '../../../app2/components/themeSwitch/ThemeSwitch';

export function Header(): JSX.Element {
  return (
    <header className="w-screen max-w-7xl p-5 flex gap-5">
      <LangSwitch />
      <ThemeSwitch />
    </header>
  );
}
