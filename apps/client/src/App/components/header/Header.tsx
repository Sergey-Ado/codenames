import { JSX } from 'react';
import { LangSwitch } from '../LangSwitch/LangSwitch';

export function Header(): JSX.Element {
  return (
    <header className="w-screen max-w-7xl p-5">
      <LangSwitch />
    </header>
  );
}
