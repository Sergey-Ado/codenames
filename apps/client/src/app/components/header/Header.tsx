import { JSX } from 'react';
import { LangSwitch } from '../langSwitch/LangSwitch';
import { ThemeSwitch } from '../themeSwitch/ThemeSwitch';

export function Header(): JSX.Element {
  return (
    <header className="w-screen max-w-7xl p-5 flex gap-5">
      <LangSwitch />
      <ThemeSwitch />
    </header>
  );
}
