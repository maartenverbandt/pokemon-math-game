import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from '../App';

vi.mock('./canvas', () => ({ default: () => <div /> }));
vi.mock('./pokedex', () => ({
  default: () => <div />,
  PokeContent: () => <div />,
}));

describe('first player', () => {
  let container;

  const click = (text) => {
    const button = Array.from(document.querySelectorAll('button'))
      .find((element) => element.textContent.trim() === text);
    expect(button).toBeTruthy();
    act(() => { button.click(); });
  };

  const render = async () => {
    await act(async () => {
      ReactDOM.render(<App />, container);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    localStorage.clear();
  });

  it('requires a player and does not create placeholder game data', async () => {
    await render();
    expect(container.textContent).toContain('Create a player to start.');
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(document.getElementById('answer')).toBeNull();
    expect(localStorage.getItem('pokemon-users')).toBeNull();
    expect(localStorage.getItem('configuration-undefined')).toBeNull();
    expect(localStorage.getItem('pokemon-undefined')).toBeNull();
    click('New player');
    click('Cancel');
    expect(container.textContent).toContain('Create a player to start.');
    expect(localStorage.getItem('pokemon-users')).toBeNull();
  });

  it('starts the game after creation and remembers the player on reload', async () => {
    await render();
    click('New player');
    const input = document.getElementById('new-player-name');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Ada');
    act(() => { input.dispatchEvent(new Event('input', { bubbles: true })); });
    click('Create');
    expect(JSON.parse(localStorage.getItem('pokemon-users'))).toEqual(['Ada']);
    expect(JSON.parse(localStorage.getItem('pokemon-last-username'))).toBe('Ada');
    expect(document.getElementById('answer')).not.toBeNull();
    expect(container.querySelector('[role="button"]').textContent).toBe('Ada');

    act(() => { ReactDOM.unmountComponentAtNode(container); });
    await render();
    expect(container.querySelector('[role="button"]').textContent).toBe('Ada');
    expect(document.getElementById('answer')).not.toBeNull();
    expect(localStorage.getItem('pokemon-undefined')).toBeNull();
  });
});
