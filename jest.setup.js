require('@testing-library/jest-dom');

jest.mock('chalk', () => ({
  bold: (text) => text,
  greenBright: (text) => text,
  yellowBright: (text) => text,
}));

// Mock console.error to suppress React warnings
console.error = jest.fn(); 