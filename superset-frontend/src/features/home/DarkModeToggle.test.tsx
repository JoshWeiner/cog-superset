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
import {
  render,
  screen,
  userEvent,
} from 'spec/helpers/testing-library';
import { DarkModeToggle } from './DarkModeToggle';

test('renders moon icon when in light mode', () => {
  render(
    <DarkModeToggle themeMode={ThemeMode.DEFAULT} setThemeMode={jest.fn()} />,
    { useTheme: true },
  );
  expect(screen.getByTestId('moon')).toBeInTheDocument();
  expect(screen.queryByTestId('sun')).not.toBeInTheDocument();
});

test('renders sun icon when in dark mode', () => {
  render(
    <DarkModeToggle themeMode={ThemeMode.DARK} setThemeMode={jest.fn()} />,
    { useTheme: true },
  );
  expect(screen.getByTestId('sun')).toBeInTheDocument();
  expect(screen.queryByTestId('moon')).not.toBeInTheDocument();
});

test('switches to dark mode when clicked from light mode', async () => {
  const setThemeMode = jest.fn();
  render(
    <DarkModeToggle
      themeMode={ThemeMode.DEFAULT}
      setThemeMode={setThemeMode}
    />,
    { useTheme: true },
  );

  const button = screen.getByTestId('dark-mode-toggle');
  expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

  await userEvent.click(button);

  expect(setThemeMode).toHaveBeenCalledTimes(1);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});

test('switches to light mode when clicked from dark mode', async () => {
  const setThemeMode = jest.fn();
  render(
    <DarkModeToggle themeMode={ThemeMode.DARK} setThemeMode={setThemeMode} />,
    { useTheme: true },
  );

  const button = screen.getByTestId('dark-mode-toggle');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

  await userEvent.click(button);

  expect(setThemeMode).toHaveBeenCalledTimes(1);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
});

test('switches to dark mode when toggled from system mode', async () => {
  const setThemeMode = jest.fn();
  render(
    <DarkModeToggle
      themeMode={ThemeMode.SYSTEM}
      setThemeMode={setThemeMode}
    />,
    { useTheme: true },
  );

  await userEvent.click(screen.getByTestId('dark-mode-toggle'));

  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});
