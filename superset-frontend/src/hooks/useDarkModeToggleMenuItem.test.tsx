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
import {
  render,
  screen,
  userEvent,
} from 'spec/helpers/testing-library';
import { ThemeMode } from '@apache-superset/core/theme';
import { Menu } from '@superset-ui/core/components';
import {
  DarkModeToggleProps,
  useDarkModeToggleMenuItem,
} from './useDarkModeToggleMenuItem';

jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  t: (key: string) => key,
}));

const TestComponent = (props: DarkModeToggleProps) => {
  const item = useDarkModeToggleMenuItem(props);
  return <Menu items={[item]} />;
};

const renderToggle = (props: Partial<DarkModeToggleProps> = {}) =>
  render(
    <TestComponent
      setThemeMode={props.setThemeMode ?? jest.fn()}
      themeMode={props.themeMode ?? ThemeMode.DEFAULT}
    />,
  );

test('renders moon icon when current mode is light', () => {
  renderToggle({ themeMode: ThemeMode.DEFAULT });
  expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
  expect(screen.getByTestId('moon')).toBeInTheDocument();
});

test('renders sun icon when current mode is dark', () => {
  renderToggle({ themeMode: ThemeMode.DARK });
  expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
  expect(screen.getByTestId('sun')).toBeInTheDocument();
});

test('switches to dark mode when clicked from light', async () => {
  const setThemeMode = jest.fn();
  renderToggle({ themeMode: ThemeMode.DEFAULT, setThemeMode });
  await userEvent.click(screen.getByRole('menuitem'));
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});

test('switches to light mode when clicked from dark', async () => {
  const setThemeMode = jest.fn();
  renderToggle({ themeMode: ThemeMode.DARK, setThemeMode });
  await userEvent.click(screen.getByRole('menuitem'));
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
});

test('switches to dark mode when clicked from system mode', async () => {
  const setThemeMode = jest.fn();
  renderToggle({ themeMode: ThemeMode.SYSTEM, setThemeMode });
  await userEvent.click(screen.getByRole('menuitem'));
  expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
});
