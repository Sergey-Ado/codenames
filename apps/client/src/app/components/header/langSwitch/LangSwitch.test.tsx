import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LangSwitch } from './LangSwitch';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

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

  it('changes the language when you click on the switch', () => {
    renderWithProvider(<LangSwitch />);

    fireEvent.click(screen.getByText('ru'));
    expect(i18next.language).toBe('ru');

    fireEvent.click(screen.getByText('en'));
    expect(i18next.language).toBe('en');
  });

  it('calls the catch function if changeLanguage fails', () => {
    const changeLanguageMock = vi
      .spyOn(i18next, 'changeLanguage')
      .mockRejectedValue(new Error('Test error'));

    render(<LangSwitch />);

    fireEvent.click(screen.getByText('en'));

    expect(changeLanguageMock).toHaveBeenCalled();

    changeLanguageMock.mockRestore();
  });
});
