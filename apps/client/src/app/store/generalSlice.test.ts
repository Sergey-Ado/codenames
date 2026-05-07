import { describe, expect, it } from 'vitest';
import generalReducer, {
  changeOpenSettings,
  initialState,
} from './generalSlice';

describe('generalSlice', () => {
  it('should return the initial state by default', () => {
    expect(generalReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('changeOpenSettings switches openSettings to true', () => {
    const action = changeOpenSettings(true);
    const state = generalReducer(initialState, action);
    expect(state.openSettings).toBe(true);
  });

  it('changeOpenSettings switches openSettings to false', () => {
    const startState = { openSettings: true };
    const action = changeOpenSettings(false);
    const state = generalReducer(startState, action);
    expect(state.openSettings).toBe(false);
  });

  it('changeOpenSettings creates the correct action', () => {
    expect(changeOpenSettings(true)).toEqual({
      type: 'general/changeOpenSettings',
      payload: true,
    });
  });
});
