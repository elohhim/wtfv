import { render } from "@testing-library/react";
import App from "./App";

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test("renders What The Fix Version? header", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/What The Fix Version\?/i);
  expect(linkElement).toBeInTheDocument();
});
