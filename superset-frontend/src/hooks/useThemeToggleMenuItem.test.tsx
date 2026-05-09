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
import { render, screen, userEvent } from 'spec/helpers/testing-library';
import { ThemeMode } from '@apache-superset/core/theme';
import { Menu } from '@superset-ui/core/components';
import {
  ThemeToggleMenuItemProps,
  useThemeToggleMenuItem,
} from './useThemeToggleMenuItem';

jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  t: (key: string) => key,
}));

const TestComponent = (props: ThemeToggleMenuItemProps) => {
  const item = useThemeToggleMenuItem(props);
  return <Menu items={[item]} />;
};

const renderToggle = (themeMode: ThemeMode, setThemeMode = jest.fn()) => {
  render(<TestComponent themeMode={themeMode} setThemeMode={setThemeMode} />);
  return setThemeMode;
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders the moon icon when in light mode', async () => {
  renderToggle(ThemeMode.DEFAULT);
  const toggle = await screen.findByTestId('dark-mode-toggle');
  expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');
  expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('renders the sun icon when in dark mode', async () => {
  renderToggle(ThemeMode.DARK);
  const toggle = await screen.findByTestId('dark-mode-toggle');
  expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
});

test('clicking flips the theme mode from light to dark', async () => {
  const setThemeMode = renderToggle(ThemeMode.DEFAULT);
  await userEvent.click(await screen.findByTestId('dark-mode-toggle'));
  expect(setThemeMode).toHaveBeenCalledTimes(1);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});

test('clicking flips the theme mode from dark to light', async () => {
  const setThemeMode = renderToggle(ThemeMode.DARK);
  await userEvent.click(await screen.findByTestId('dark-mode-toggle'));
  expect(setThemeMode).toHaveBeenCalledTimes(1);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
});

test('respects prefers-color-scheme: dark when themeMode is SYSTEM', async () => {
  const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  });

  const setThemeMode = renderToggle(ThemeMode.SYSTEM);
  const toggle = await screen.findByTestId('dark-mode-toggle');
  expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await userEvent.click(toggle);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
});

test('respects prefers-color-scheme: light when themeMode is SYSTEM', async () => {
  const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  });

  const setThemeMode = renderToggle(ThemeMode.SYSTEM);
  const toggle = await screen.findByTestId('dark-mode-toggle');
  expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await userEvent.click(toggle);
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});
