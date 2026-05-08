import { describe, expect, it } from 'vitest';
import store from './store';
import { changeOpenSettings, initialState } from './generalSlice';

describe('Redux store', () => {
  it('created with the correct initial state', () => {
    const state = store.getState();
    expect(state.general).toEqual(initialState);
  });

  it('dispatch work with changeOpenSettings', () => {
    store.dispatch(changeOpenSettings(true));
    expect(store.getState().general.openSettings).toBe(true);

    store.dispatch(changeOpenSettings(false));
    expect(store.getState().general.openSettings).toBe(false);
  });
});
