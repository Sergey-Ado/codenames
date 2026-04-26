import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LangSwitch } from '../../../app/components/langSwitch/LangSwitch';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

beforeEach(async () => {
  await i18next.init({
    lng: 'en',
    supportedLngs: ['en', 'ru'],
    fallbackLng: 'en',
    resources: {
      en: { translation: {} },
      ru: { translation: {} },
    },
  });
});

function renderWithProvider(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18next}>{ui}</I18nextProvider>);
}

describe('LangSwitch', () => {
  it('sets the default language to en', () => {
    renderWithProvider(<LangSwitch />);

    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('ru')).toBeInTheDocument();
    expect(i18next.language).toBe('en');
  });

  it('changes the language when you click on the switch', async () => {
    renderWithProvider(<LangSwitch />);
    const user = userEvent.setup();

    await user.click(screen.getByText('ru'));
    expect(i18next.language).toBe('ru');

    await user.click(screen.getByText('en'));
    expect(i18next.language).toBe('en');
  });

  it('calls the catch function if changeLanguage fails', async () => {
    const changeLanguageMock = vi
      .spyOn(i18next, 'changeLanguage')
      .mockRejectedValue(new Error('Test error'));

    render(<LangSwitch />);
    const user = userEvent.setup();

    await user.click(screen.getByText('en'));

    expect(changeLanguageMock).toHaveBeenCalled();

    changeLanguageMock.mockRestore();
  });
});
