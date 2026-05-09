/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ThemeMode } from '@apache-superset/core/theme';
import { render, screen, userEvent } from 'spec/helpers/testing-library';
import { ThemeToggle } from './ThemeToggle';

const mockSetThemeMode = jest.fn();
const mockCanSetMode = jest.fn();
let mockThemeMode: ThemeMode = ThemeMode.DEFAULT;

jest.mock('src/theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    setThemeMode: mockSetThemeMode,
    themeMode: mockThemeMode,
    canSetMode: mockCanSetMode,
  }),
}));

beforeEach(() => {
  mockSetThemeMode.mockClear();
  mockCanSetMode.mockReset();
  mockCanSetMode.mockReturnValue(true);
  mockThemeMode = ThemeMode.DEFAULT;
});

test('renders nothing when canSetMode is false', () => {
  mockCanSetMode.mockReturnValue(false);
  const { container } = render(<ThemeToggle />);
  expect(container).toBeEmptyDOMElement();
});

test('renders moon icon and "switch to dark" label when in light mode', () => {
  mockThemeMode = ThemeMode.DEFAULT;
  render(<ThemeToggle />);
  const button = screen.getByTestId('theme-toggle');
  expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  expect(button.querySelector('[aria-label="moon"]')).not.toBeNull();
});

test('renders sun icon and "switch to light" label when in dark mode', () => {
  mockThemeMode = ThemeMode.DARK;
  render(<ThemeToggle />);
  const button = screen.getByTestId('theme-toggle');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  expect(button.querySelector('[aria-label="sun"]')).not.toBeNull();
});

test('clicking the toggle in light mode switches to DARK', async () => {
  mockThemeMode = ThemeMode.DEFAULT;
  render(<ThemeToggle />);
  await userEvent.click(screen.getByTestId('theme-toggle'));
  expect(mockSetThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});

test('clicking the toggle in dark mode switches to DEFAULT', async () => {
  mockThemeMode = ThemeMode.DARK;
  render(<ThemeToggle />);
  await userEvent.click(screen.getByTestId('theme-toggle'));
  expect(mockSetThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
});

test('clicking the toggle when in SYSTEM mode coerces to DARK', async () => {
  mockThemeMode = ThemeMode.SYSTEM;
  render(<ThemeToggle />);
  await userEvent.click(screen.getByTestId('theme-toggle'));
  expect(mockSetThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});
