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

/**
 * Returns a single MenuItem that toggles between light and dark theme on click.
 * Renders a sun icon when light is active and a moon icon when dark is active.
 */
export const useDarkModeToggleMenuItem = ({
  setThemeMode,
  themeMode,
}: DarkModeToggleProps): MenuItem => {
  const isDark = themeMode === ThemeMode.DARK;

  const tooltipText = isDark
    ? t('Switch to light mode')
    : t('Switch to dark mode');

  const icon = useMemo(
    () => (isDark ? <Icons.SunOutlined /> : <Icons.MoonOutlined />),
    [isDark],
  );

  return {
    key: 'dark-mode-toggle',
    label: (
      <Tooltip title={tooltipText} placement="bottom">
        <span data-test="dark-mode-toggle">{icon}</span>
      </Tooltip>
    ),
    onClick: () => setThemeMode(isDark ? ThemeMode.DEFAULT : ThemeMode.DARK),
  };
};
