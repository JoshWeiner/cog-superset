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
import { useThemeContext } from 'src/theme/ThemeProvider';
import { DarkModeToggle } from './DarkModeToggle';

jest.mock('src/theme/ThemeProvider', () => ({
  useThemeContext: jest.fn(),
}));

const mockUseThemeContext = useThemeContext as jest.MockedFunction<
  typeof useThemeContext
>;

const buildContext = (overrides: Partial<ReturnType<typeof useThemeContext>>) =>
  ({
    themeMode: ThemeMode.DEFAULT,
    setThemeMode: jest.fn(),
    canSetMode: () => true,
    ...overrides,
  }) as unknown as ReturnType<typeof useThemeContext>;

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders moon icon with "Switch to dark mode" label when in light mode', () => {
  mockUseThemeContext.mockReturnValue(
    buildContext({ themeMode: ThemeMode.DEFAULT }),
  );

  render(<DarkModeToggle />);

  const button = screen.getByTestId('dark-mode-toggle');
  expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByTestId('moon')).toBeInTheDocument();
});

test('renders sun icon with "Switch to light mode" label when in dark mode', () => {
  mockUseThemeContext.mockReturnValue(
    buildContext({ themeMode: ThemeMode.DARK }),
  );

  render(<DarkModeToggle />);

  const button = screen.getByTestId('dark-mode-toggle');
  expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByTestId('sun')).toBeInTheDocument();
});

test('switches to dark mode when clicked from light mode', async () => {
  const setThemeMode = jest.fn();
  mockUseThemeContext.mockReturnValue(
    buildContext({ themeMode: ThemeMode.DEFAULT, setThemeMode }),
  );

  render(<DarkModeToggle />);

  await userEvent.click(screen.getByTestId('dark-mode-toggle'));

  expect(setThemeMode).toHaveBeenCalledTimes(1);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});

test('switches to light mode when clicked from dark mode', async () => {
  const setThemeMode = jest.fn();
  mockUseThemeContext.mockReturnValue(
    buildContext({ themeMode: ThemeMode.DARK, setThemeMode }),
  );

  render(<DarkModeToggle />);

  await userEvent.click(screen.getByTestId('dark-mode-toggle'));

  expect(setThemeMode).toHaveBeenCalledTimes(1);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
});

test('renders nothing when theme mode cannot be changed', () => {
  mockUseThemeContext.mockReturnValue(
    buildContext({ canSetMode: () => false }),
  );

  render(<DarkModeToggle />);

  expect(screen.queryByTestId('dark-mode-toggle')).not.toBeInTheDocument();
});
