function onLoginClick() {
  console.log('login');
}

function onRegisterClick() {
  console.log('register');
}

export function Welcome() {
  return (
    <main className="grow flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center max-w-160 border rounded-lg bg-[#27272773] shadow-[0_0_20px_0_#27272773] py-8 px-8 text-white mx-8 border-white">
        <h2 className="max-[450px]:text-2xl text-3xl text-shadow-[3px_3px_rgb(0,0,0)]">
          Добро пожаловать
        </h2>
        <span>в игру</span>
        <h1 className="uppercase max-[450px]:text-4xl text-5xl font-perm text-amber-300 max-[450px]:my-1 my-4 text-shadow-[3px_3px_rgb(0,0,0)]">
          codenames
        </h1>
        <p className="text-center text-shadow-[3px_3px_black]">
          Здесь вы, играя, сможете улучшить и проверить свои знания в таких
          популярных языках как JavaScript и TypeScript
        </p>
        <div className="flex gap-4 mt-6 text-black">
          <button
            type="button"
            className="py-2 px-4 bg-white rounded-lg capitalize hover:bg-[rgb(147,147,147)] duration-300 outline-none w-25 cursor-pointer"
            onClick={onLoginClick}>
            login
          </button>
          <button
            type="button"
            className="py-2 px-4 bg-white rounded-lg capitalize hover:bg-[rgb(147,147,147)] duration-300 outline-none w-25 cursor-pointer"
            onClick={onRegisterClick}>
            register
          </button>
        </div>
      </div>
    </main>
  );
}
