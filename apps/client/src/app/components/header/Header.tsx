import { Logo } from './logo/Logo';

export function Header() {
  return (
    <header className="w-screen max-w-7xl p-5 flex gap-5 items-center">
      <Logo />
      <div className="grow"></div>
    </header>
  );
}
