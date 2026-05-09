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
import { useMemo } from 'react';
import { Icons, Tooltip } from '@superset-ui/core/components';
import type { MenuItem } from '@superset-ui/core/components/Menu';
import { t } from '@apache-superset/core/translation';
import { ThemeMode } from '@apache-superset/core/theme';

export interface ThemeToggleMenuItemProps {
  setThemeMode: (newMode: ThemeMode) => void;
  themeMode: ThemeMode;
}

const prefersDarkColorScheme = (): boolean => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Returns a MenuItem rendering an icon-only sun/moon button that toggles the
 * top-nav theme between light and dark. Persistence and OS preference fallback
 * are handled by the existing ThemeController/ThemeProvider.
 */
export const useThemeToggleMenuItem = ({
  setThemeMode,
  themeMode,
}: ThemeToggleMenuItemProps): MenuItem => {
  const isDark = useMemo(
    () =>
      themeMode === ThemeMode.DARK ||
      (themeMode === ThemeMode.SYSTEM && prefersDarkColorScheme()),
    [themeMode],
  );

  const targetMode = isDark ? ThemeMode.DEFAULT : ThemeMode.DARK;
  const tooltipText = isDark
    ? t('Switch to light mode')
    : t('Switch to dark mode');

  return {
    key: 'theme-toggle',
    label: (
      <Tooltip title={tooltipText} placement="bottom">
        <span
          role="button"
          aria-label={tooltipText}
          aria-pressed={isDark}
          data-test="dark-mode-toggle"
        >
          {isDark ? <Icons.SunOutlined /> : <Icons.MoonOutlined />}
        </span>
      </Tooltip>
    ),
    onClick: () => setThemeMode(targetMode),
  };
};
