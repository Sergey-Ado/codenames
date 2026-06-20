import { ModalWrapper } from '../modalWrapper/ModalWrapper';

export function Spinner() {
  return (
    <ModalWrapper>
      <div
        className="inline-block h-10 w-10 mb-10 animate-spin rounded-full border-5 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-primary-dark dark:text-white"
        role="status"></div>
    </ModalWrapper>
  );
}
