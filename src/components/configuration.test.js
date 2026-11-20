import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from '../App';

vi.mock('./canvas', () => ({ default: () => <div /> }));
vi.mock('./pokedex', () => ({
  default: () => <div />,
  PokeContent: () => <div />,
}));

describe('exercise configuration', () => {
  let container;

  const click = (element) => {
    expect(element).not.toBeNull();
    act(() => { element.click(); });
  };

  const button = (text) => Array.from(document.querySelectorAll('button'))
    .find((element) => element.textContent.trim() === text);

  const question = () => container.querySelector('label[for="answer"]').textContent;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('configuration-trainer 1', JSON.stringify([false, true, false, false, false, false, false, false, false, false]));
    localStorage.setItem('configuration-trainer 2', JSON.stringify([false, false, true, false, false, false, false, false, false, false]));
    localStorage.setItem('configuration-operation-trainer 2', JSON.stringify('multiplication'));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    container = document.createElement('div');
    document.body.appendChild(container);
    act(() => { ReactDOM.render(<App />, container); });
    click(button('Configuration'));
  });

  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('updates questions immediately and remembers each user’s choice', async () => {
    expect(container.querySelector('input[value="both"]').checked).toBe(true);
    expect(question()).toBe('5 x 2 = ');

    click(container.querySelector('input[value="division"]'));
    expect(question()).toBe('10 : 2 = ');
    click(container.querySelector('input[value="multiplication"]'));
    expect(question()).toBe('5 x 2 = ');

    const tables = container.querySelectorAll('input[type="checkbox"]');
    click(tables[2]);
    click(tables[1]);
    expect(question()).toBe('5 x 3 = ');

    Math.random.mockReturnValue(0.1);
    click(container.querySelector('input[value="both"]'));
    expect(question()).toBe('3 : 3 = ');
    const input = document.getElementById('answer');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '1');
    act(() => { input.dispatchEvent(new Event('input', { bubbles: true })); });
    Math.random.mockReturnValue(0.9);
    click(document.getElementById('ok'));
    expect(question()).toBe('9 x 3 = ');

    click(container.querySelector('input[value="division"]'));
    expect(JSON.parse(localStorage.getItem('configuration-operation-trainer 1'))).toBe('division');
    click(button('Close'));

    const changeUser = async (name) => {
      act(() => {
        Array.from(container.querySelectorAll('[role="button"]'))
          .find((element) => element.textContent.trim().startsWith('trainer ')).dispatchEvent(
          new MouseEvent('mousedown', { bubbles: true, button: 0 })
        );
      });
      const option = Array.from(document.querySelectorAll('[role="option"]'))
        .find((element) => element.textContent.trim() === name);
      expect(option).not.toBeUndefined();
      await act(async () => {
        option.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    };

    await changeUser('trainer 2');
    expect(question()).toBe('9 x 3 = ');
    click(button('Configuration'));
    expect(container.querySelector('input[value="multiplication"]').checked).toBe(true);
    click(button('Close'));

    await changeUser('trainer 1');
    expect(question()).toBe('27 : 3 = ');
    click(button('Configuration'));
    expect(container.querySelector('input[value="division"]').checked).toBe(true);

    act(() => { ReactDOM.unmountComponentAtNode(container); });
    await act(async () => {
      ReactDOM.render(<App />, container);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(question()).toBe('27 : 3 = ');
    click(button('Configuration'));
    expect(container.querySelector('input[value="division"]').checked).toBe(true);
  });
});
