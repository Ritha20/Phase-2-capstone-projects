// jest.setup.js
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver;