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
  DarkModeToggleProps,
  useDarkModeToggleItem,
} from './useDarkModeToggleItem';

jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  t: (key: string) => key,
}));

const TestComponent = (props: DarkModeToggleProps) => {
  const menuItem = useDarkModeToggleItem(props);
  return <Menu items={[menuItem]} mode="horizontal" />;
};

const renderToggle = (props: DarkModeToggleProps) =>
  render(<TestComponent {...props} />);

// eslint-disable-next-line no-restricted-globals -- TODO: Migrate from describe blocks
describe('useDarkModeToggleItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the moon icon when current mode is light (DEFAULT)', () => {
    renderToggle({ setThemeMode: jest.fn(), themeMode: ThemeMode.DEFAULT });
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('moon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun')).not.toBeInTheDocument();
  });

  test('renders the sun icon when current mode is DARK', () => {
    renderToggle({ setThemeMode: jest.fn(), themeMode: ThemeMode.DARK });
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('sun')).toBeInTheDocument();
    expect(screen.queryByTestId('moon')).not.toBeInTheDocument();
  });

  test('renders the moon icon when current mode is SYSTEM', () => {
    renderToggle({ setThemeMode: jest.fn(), themeMode: ThemeMode.SYSTEM });
    expect(screen.getByTestId('moon')).toBeInTheDocument();
  });

  test('switches to DARK when clicked from light mode', async () => {
    const setThemeMode = jest.fn();
    renderToggle({ setThemeMode, themeMode: ThemeMode.DEFAULT });

    await userEvent.click(screen.getByTestId('dark-mode-toggle'));

    expect(setThemeMode).toHaveBeenCalledTimes(1);
    expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
  });

  test('switches to DEFAULT (light) when clicked from dark mode', async () => {
    const setThemeMode = jest.fn();
    renderToggle({ setThemeMode, themeMode: ThemeMode.DARK });

    await userEvent.click(screen.getByTestId('dark-mode-toggle'));

    expect(setThemeMode).toHaveBeenCalledTimes(1);
    expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DEFAULT);
  });

  test('switches to DARK when clicked from SYSTEM mode', async () => {
    const setThemeMode = jest.fn();
    renderToggle({ setThemeMode, themeMode: ThemeMode.SYSTEM });

    await userEvent.click(screen.getByTestId('dark-mode-toggle'));

    expect(setThemeMode).toHaveBeenCalledWith(ThemeMode.DARK);
  });
});
