import { render } from "@testing-library/react";
import App from "./App";

test("renders What The Fix Version? header", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/What The Fix Version\?/i);
  expect(linkElement).toBeInTheDocument();
});
