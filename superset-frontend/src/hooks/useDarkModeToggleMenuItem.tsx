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
import { useCallback, useEffect } from 'react';
import { ThemeMode } from '@apache-superset/core/theme';
import { Icons, Tooltip } from '@superset-ui/core/components';
import { t } from '@apache-superset/core/translation';
import type { MenuItem } from '@superset-ui/core/components/Menu';

export const DARK_MODE_STORAGE_KEY = 'superset.theme';

const STORED_DARK = 'dark';
const STORED_LIGHT = 'light';

const readStoredMode = (): ThemeMode | null => {
  try {
    const value = window.localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (value === STORED_DARK) return ThemeMode.DARK;
    if (value === STORED_LIGHT) return ThemeMode.DEFAULT;
  } catch {
    // localStorage may be unavailable (e.g. SSR or sandboxed iframe)
  }
  return null;
};

const writeStoredMode = (mode: ThemeMode): void => {
  try {
    window.localStorage.setItem(
      DARK_MODE_STORAGE_KEY,
      mode === ThemeMode.DARK ? STORED_DARK : STORED_LIGHT,
    );
  } catch {
    // localStorage may be unavailable
  }
};

const prefersDark = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  } catch {
    return false;
  }
};

export interface DarkModeToggleProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

/**
 * Returns a MenuItem rendering an icon-only sun/moon button that toggles
 * the active theme between light and dark using the existing
 * `ThemeProvider` machinery. The chosen mode is persisted in
 * `localStorage` under `superset.theme`. On first load with no stored
 * preference, the user's `prefers-color-scheme` is honored.
 */
export const useDarkModeToggleMenuItem = ({
  themeMode,
  setThemeMode,
}: DarkModeToggleProps): MenuItem => {
  useEffect(() => {
    const stored = readStoredMode();
    if (stored !== null) {
      if (stored !== themeMode) {
        setThemeMode(stored);
      }
      return;
    }
    if (themeMode === ThemeMode.SYSTEM) {
      const initial = prefersDark() ? ThemeMode.DARK : ThemeMode.DEFAULT;
      writeStoredMode(initial);
      setThemeMode(initial);
    }
    // Run once on mount; subsequent changes flow through `handleToggle`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = themeMode === ThemeMode.DARK;

  const handleToggle = useCallback(() => {
    const next = isDark ? ThemeMode.DEFAULT : ThemeMode.DARK;
    writeStoredMode(next);
    setThemeMode(next);
  }, [isDark, setThemeMode]);

  const tooltip = isDark ? t('Switch to light mode') : t('Switch to dark mode');
  const icon = isDark ? (
    <Icons.SunOutlined data-test="dark-mode-toggle-icon" aria-label={tooltip} />
  ) : (
    <Icons.MoonOutlined
      data-test="dark-mode-toggle-icon"
      aria-label={tooltip}
    />
  );

  return {
    key: 'dark-mode-toggle',
    label: <Tooltip title={tooltip}>{icon}</Tooltip>,
    onClick: handleToggle,
  };
};
