// src/app/__tests__/home.basic.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock fetch to resolve immediately with empty posts
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({ posts: [] }),
  }) as Promise<Response>
);

describe('Home Page - Static Content', () => {
  test('renders main heading after loading', async () => {
    render(<Home />);
    
    // Wait for loading to complete and content to appear
    await waitFor(() => {
      // The heading is split across multiple elements, so we need to check the parent
      const headingElement = screen.getByRole('heading', { level: 1 });
      expect(headingElement).toBeTruthy();
      expect(headingElement.textContent).toContain('Welcome To Ikaze');
    });
  });

  test('renders description text after loading', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const description = screen.getByText(/Discover and share stories/i);
      expect(description).toBeTruthy();
    });
  });

  test('renders both action buttons after loading', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const startButton = screen.getByText(/Start Reading/i); // Updated to match actual text
      const learnMoreButton = screen.getByText(/Learn More/i);
      
      expect(startButton).toBeTruthy();
      expect(learnMoreButton).toBeTruthy();
    });
  });

  test('renders stats section after loading', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('100+')).toBeTruthy();
      expect(screen.getByText('Stories')).toBeTruthy();
      expect(screen.getByText('Writers')).toBeTruthy();
      expect(screen.getByText('Readers')).toBeTruthy();
    });
  });

  test('renders empty posts message', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeTruthy();
      expect(screen.getByText(/Write Your First Post/i)).toBeTruthy();
    });
  });
});