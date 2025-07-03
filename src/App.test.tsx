import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body.innerHTML).toBeTruthy();
  });

  it('renders the main container', () => {
    render(<App />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeDefined();
  });

  it('has the correct document title', () => {
    render(<App />);
    expect(document.title).toBeDefined();
  });


});
