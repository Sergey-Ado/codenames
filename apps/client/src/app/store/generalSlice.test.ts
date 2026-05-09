import { describe, expect, it } from 'vitest';
import generalReducer, {
  changeOpenAvatarMenu,
  changeOpenSettings,
  changeUserdata,
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
    const startState = {
      openSettings: true,
      userdata: {
        id: '',
        username: '',
      },
      openAvatarMenu: false,
    };
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

  it('changeUserdata switches userdata', () => {
    const userdata = { id: 'userId', username: 'username' };
    const action = changeUserdata(userdata);
    const state = generalReducer(initialState, action);
    expect(state.userdata).toEqual(userdata);
  });

  it('changeUserdata creates the correct action', () => {
    const userdata = { id: 'userId', username: 'username' };

    expect(changeUserdata(userdata)).toEqual({
      type: 'general/changeUserdata',
      payload: userdata,
    });
  });

  it('changeOpenAvatar switches openAvatarMenu ', () => {
    const action = changeOpenAvatarMenu(true);
    const state = generalReducer(initialState, action);
    expect(state.openAvatarMenu).toEqual(true);
  });

  it('changeOpenAvatar creates the correct action', () => {
    expect(changeOpenAvatarMenu(true)).toEqual({
      type: 'general/changeOpenAvatarMenu',
      payload: true,
    });
  });
});
