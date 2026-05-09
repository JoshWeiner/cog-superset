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
import { useState } from 'react';
import { render, screen, userEvent } from 'spec/helpers/testing-library';
import { ThemeMode } from '@apache-superset/core/theme';
import { Menu } from '@superset-ui/core/components';
import {
  DARK_MODE_STORAGE_KEY,
  useDarkModeToggleMenuItem,
} from './useDarkModeToggleMenuItem';

const TestHarness = ({
  initialMode = ThemeMode.DEFAULT,
  onChange,
}: {
  initialMode?: ThemeMode;
  onChange?: (mode: ThemeMode) => void;
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const item = useDarkModeToggleMenuItem({
    themeMode: mode,
    setThemeMode: next => {
      setMode(next);
      onChange?.(next);
    },
  });
  return <Menu items={[item]} />;
};

beforeEach(() => {
  window.localStorage.clear();
  jest.restoreAllMocks();
});

test('renders moon icon when starting in light mode', () => {
  render(<TestHarness initialMode={ThemeMode.DEFAULT} />);
  expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
});

test('renders sun icon when starting in dark mode', () => {
  render(<TestHarness initialMode={ThemeMode.DARK} />);
  expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
});

test('clicking the toggle flips the theme mode', async () => {
  const onChange = jest.fn();
  render(<TestHarness initialMode={ThemeMode.DEFAULT} onChange={onChange} />);

  await userEvent.click(screen.getByLabelText('Switch to dark mode'));
  expect(onChange).toHaveBeenLastCalledWith(ThemeMode.DARK);
  expect(window.localStorage.getItem(DARK_MODE_STORAGE_KEY)).toBe('dark');

  await userEvent.click(screen.getByLabelText('Switch to light mode'));
  expect(onChange).toHaveBeenLastCalledWith(ThemeMode.DEFAULT);
  expect(window.localStorage.getItem(DARK_MODE_STORAGE_KEY)).toBe('light');
});

test('on mount, applies stored preference from localStorage', () => {
  window.localStorage.setItem(DARK_MODE_STORAGE_KEY, 'dark');
  const onChange = jest.fn();
  render(<TestHarness initialMode={ThemeMode.DEFAULT} onChange={onChange} />);

  expect(onChange).toHaveBeenCalledWith(ThemeMode.DARK);
});

test('on mount with SYSTEM mode and no stored preference, honors prefers-color-scheme', () => {
  jest.spyOn(window, 'matchMedia').mockImplementation(
    query =>
      ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }) as MediaQueryList,
  );

  const onChange = jest.fn();
  render(<TestHarness initialMode={ThemeMode.SYSTEM} onChange={onChange} />);

  expect(onChange).toHaveBeenCalledWith(ThemeMode.DARK);
  expect(window.localStorage.getItem(DARK_MODE_STORAGE_KEY)).toBe('dark');
});

test('does not override existing explicit theme when localStorage is empty', () => {
  const onChange = jest.fn();
  render(<TestHarness initialMode={ThemeMode.DARK} onChange={onChange} />);
  expect(onChange).not.toHaveBeenCalled();
});
