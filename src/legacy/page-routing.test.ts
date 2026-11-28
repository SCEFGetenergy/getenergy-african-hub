import { describe, expect, it } from 'vitest';
import { isReactPage } from './page-routing';

describe('request-answer route ownership', () => {
  it('renders request references through the React outlet', () => {
    expect(isReactPage('/r/GE-2611-01096')).toBe(true);
    expect(isReactPage('/r/GETELEC-20261128-1234')).toBe(true);
  });
  it('does not consume unrelated legacy or unknown routes', () => {
    expect(isReactPage('/register')).toBe(false);
    expect(isReactPage('/renewables-bess')).toBe(false);
    expect(isReactPage('/random-missing-page')).toBe(false);
    expect(isReactPage('/answers-missing')).toBe(false);
  });
});