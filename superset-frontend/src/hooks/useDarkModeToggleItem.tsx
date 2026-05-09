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

export interface DarkModeToggleProps {
  setThemeMode: (newMode: ThemeMode) => void;
  themeMode: ThemeMode;
}

export const DARK_MODE_TOGGLE_KEY = 'dark-mode-toggle';

/**
 * Returns a single, top-level navbar menu item that toggles between the
 * light (DEFAULT) and dark theme modes in a single click. Intended to live
 * alongside the existing theme submenu so users can flip between modes
 * quickly without opening a dropdown.
 */
export const useDarkModeToggleItem = ({
  setThemeMode,
  themeMode,
}: DarkModeToggleProps): MenuItem => {
  const isDark = themeMode === ThemeMode.DARK;

  return useMemo(
    () => ({
      key: DARK_MODE_TOGGLE_KEY,
      label: (
        <Tooltip
          placement="bottom"
          title={isDark ? t('Switch to light mode') : t('Switch to dark mode')}
        >
          {isDark ? (
            <Icons.SunOutlined data-test="dark-mode-toggle" />
          ) : (
            <Icons.MoonOutlined data-test="dark-mode-toggle" />
          )}
        </Tooltip>
      ),
      onClick: () => setThemeMode(isDark ? ThemeMode.DEFAULT : ThemeMode.DARK),
    }),
    [isDark, setThemeMode],
  );
};
