import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function ErrorPage() {
  const { t } = useTranslation();

  const title = t('error.title');
  const desc = t('error.desc');
  const back = t('error.back');

  const navigate = useNavigate();

  const handleBack = async () => {
    await navigate(-1);
  };

  return (
    <main className="grow flex justify-center items-center">
      <div className="container flex flex-col items-center gap-3 p-4">
        <h2 className="capitalize text-2xl" role="error-title">
          {title}
        </h2>
        <p className="pb-4">{desc}</p>
        <button className="button px-4 py-2" onClick={handleBack}>
          {back}
        </button>
      </div>
    </main>
  );
}
