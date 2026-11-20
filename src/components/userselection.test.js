import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import UserSelect from './userselection';

describe('player selection', () => {
  let container;
  let changeUser;

  const render = async () => {
    await act(async () => {
      ReactDOM.render(<UserSelect changeUser={changeUser} />, container);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  const click = (element) => {
    expect(element).toBeTruthy();
    act(() => { element.click(); });
  };

  const button = (text) => Array.from(document.querySelectorAll('button'))
    .find((element) => element.textContent.trim() === text);

  const enterName = (value) => {
    const input = document.querySelector('[role="dialog"] input');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
    act(() => { input.dispatchEvent(new Event('input', { bubbles: true })); });
  };

  beforeEach(() => {
    localStorage.clear();
    changeUser = vi.fn();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('creates, selects, and reloads a player while retaining the existing trainers', async () => {
    localStorage.setItem('pokemon-last-username', JSON.stringify('trainer 2'));
    await render();
    expect(changeUser).toHaveBeenLastCalledWith('trainer 2');

    click(button('New player'));
    expect(document.querySelector('label[for="new-player-name"]')).not.toBeNull();
    enterName('  Ada  ');
    click(button('Create'));
    expect(changeUser).toHaveBeenLastCalledWith('Ada');
    expect(JSON.parse(localStorage.getItem('pokemon-users'))).toEqual([
      'trainer 1', 'trainer 2', 'trainer 3', 'trainer 4', 'Ada',
    ]);
    expect(JSON.parse(localStorage.getItem('pokemon-last-username'))).toBe('Ada');

    act(() => { ReactDOM.unmountComponentAtNode(container); });
    await render();
    expect(changeUser).toHaveBeenLastCalledWith('Ada');
    expect(container.querySelector('[role="button"]').textContent).toBe('Ada');

    act(() => {
      container.querySelector('[role="button"]').dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, button: 0 })
      );
    });
    const trainer = Array.from(document.querySelectorAll('[role="option"]'))
      .find((option) => option.textContent.trim() === 'trainer 1');
    click(trainer);
    expect(changeUser).toHaveBeenLastCalledWith('trainer 1');
    expect(JSON.parse(localStorage.getItem('pokemon-last-username'))).toBe('trainer 1');
  });

  it('retains a previously selected player not in the original trainer list', async () => {
    localStorage.setItem('pokemon-last-username', JSON.stringify('Existing player'));
    localStorage.setItem('pokemon-Existing player', JSON.stringify([{ index: 25, power: 100 }]));
    await render();
    expect(changeUser).toHaveBeenLastCalledWith('Existing player');
    expect(JSON.parse(localStorage.getItem('pokemon-users'))).toContain('Existing player');
    expect(JSON.parse(localStorage.getItem('pokemon-Existing player'))).toEqual([{ index: 25, power: 100 }]);
  });

  it('rejects empty or duplicate names and cancellation leaves the list unchanged', async () => {
    localStorage.setItem('pokemon-users', JSON.stringify(['trainer 1']));
    await render();
    const original = localStorage.getItem('pokemon-users');
    click(button('New player'));
    enterName('   ');
    click(button('Create'));
    expect(document.body.textContent).toContain('Enter a player name.');
    enterName(' TRAINER 1 ');
    click(button('Create'));
    expect(document.body.textContent).toContain('That player name already exists.');
    enterName('operation-trainer 1');
    click(button('Create'));
    expect(document.body.textContent).toContain('That name conflicts with saved settings.');
    enterName('Not saved');
    click(button('Cancel'));
    expect(localStorage.getItem('pokemon-users')).toBe(original);
    expect(changeUser).toHaveBeenLastCalledWith('trainer 1');
  });

  it('reports storage failures without adding or selecting the player', async () => {
    localStorage.setItem('pokemon-users', JSON.stringify(['trainer 1']));
    await render();
    const original = localStorage.getItem('pokemon-users');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    click(button('New player'));
    enterName('Ada');
    click(button('Create'));
    expect(document.body.textContent).toContain('Could not save the player in browser storage.');
    expect(localStorage.getItem('pokemon-users')).toBe(original);
    expect(changeUser).toHaveBeenLastCalledWith('trainer 1');
  });

  it('allows the first player to be created when the saved list is empty', async () => {
    localStorage.setItem('pokemon-users', '[]');
    await render();
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(changeUser).not.toHaveBeenCalled();
    click(button('New player'));
    enterName('Ada');
    click(button('Create'));
    expect(JSON.parse(localStorage.getItem('pokemon-users'))).toEqual(['Ada']);
    expect(changeUser).toHaveBeenLastCalledWith('Ada');
  });
});
