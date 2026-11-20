import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import PokeCanvas from './pokeCanvas';

vi.mock('./canvas', () => ({
  default: ({ covered, path }) => <div data-testid="covers" data-path={path}>{covered.length}</div>,
}));

vi.mock('./pokedex', () => ({
  PokeContent: ({ pokeindex, power }) => <div>Pokemon {pokeindex}, power {power}</div>,
}));

describe('catching Pokemon', () => {
  let container;

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    container = document.createElement('div');
    document.body.appendChild(container);
    act(() => { ReactDOM.render(<PokeCanvas username="test" tableconfig={Array(10).fill(true)} operation="both" />, container); });
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const solve = (count) => {
    for (let i = 0; i < count; i++) {
      const input = document.getElementById('answer');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '30');
      act(() => { input.dispatchEvent(new Event('input', { bubbles: true })); });
      expect(input.value).toBe('30');
      act(() => { document.getElementById('ok').click(); });
    }
  };

  it('starts fresh rounds after dismissing the catch without duplicating rewards', () => {
    expect(container.querySelector('label').textContent).toBe('5 x 6 = ');
    solve(8);
    const input = document.getElementById('answer');
    input.focus();
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '30');
    act(() => { input.dispatchEvent(new Event('input', { bubbles: true })); });
    const enter = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true });
    act(() => { input.dispatchEvent(enter); });
    expect(enter.defaultPrevented).toBe(true);
    expect(container.querySelector('[data-testid="covers"]').textContent).toBe('0');
    expect(document.querySelector('[role="dialog"]').textContent).toContain('Pokemon 251, power 2200');
    expect(document.activeElement.textContent).not.toBe('Next');
    expect(JSON.parse(localStorage.getItem('pokemoney-test'))).toBe(10);

    act(() => { document.querySelector('[role="dialog"]').click(); });
    expect(container.querySelector('[data-testid="covers"]').textContent).toBe('0');
    Math.random.mockReturnValueOnce(0.6);
    act(() => { document.querySelector('.MuiBackdrop-root').click(); });
    expect(container.querySelector('[data-testid="covers"]').textContent).toBe('9');
    expect(container.querySelector('[data-testid="covers"]').dataset.path).toContain('/301.png');
    expect(document.getElementById('answer')).not.toBeNull();
    expect(JSON.parse(localStorage.getItem('pokemon-test'))).toHaveLength(1);

    solve(8);
    expect(container.querySelector('[data-testid="covers"]').textContent).toBe('1');
    expect(JSON.parse(localStorage.getItem('pokemon-test'))).toHaveLength(1);
    solve(1);
    expect(JSON.parse(localStorage.getItem('pokemon-test'))).toEqual([
      { index: 251, power: 2200 },
      { index: 301, power: 2200 },
    ]);
    expect(JSON.parse(localStorage.getItem('pokemoney-test'))).toBe(20);

    act(() => {
      document.querySelector('[role="dialog"]').dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape', keyCode: 27, bubbles: true,
      }));
    });
    expect(container.querySelector('[data-testid="covers"]').textContent).toBe('9');
    expect(document.getElementById('answer')).not.toBeNull();

    solve(9);
    const next = Array.from(document.querySelectorAll('button')).find((button) => button.textContent === 'Next');
    act(() => { next.click(); });
    expect(container.querySelector('[data-testid="covers"]').textContent).toBe('9');
    expect(JSON.parse(localStorage.getItem('pokemon-test'))).toHaveLength(3);
    expect(JSON.parse(localStorage.getItem('pokemoney-test'))).toBe(30);
  });
});
