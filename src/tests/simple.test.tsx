// src/__tests__/simple.test.tsx
import { render, screen } from '@testing-library/react';

// Test a simple component first
function SimpleComponent() {
  return (
    <div>
      <h1>Welcome To Ikaze</h1>
      <button>Start Reading</button>
    </div>
  );
}

describe('Simple Component Test', () => {
  test('renders heading', () => {
    render(<SimpleComponent />);
    
    // Use getByText instead of toBeInTheDocument for now
    const heading = screen.getByText('Welcome To Ikaze');
    expect(heading).toBeTruthy(); // Simple assertion
  });

  test('renders button', () => {
    render(<SimpleComponent />);
    
    const button = screen.getByText('Start Reading');
    expect(button).toBeTruthy();
  });
});