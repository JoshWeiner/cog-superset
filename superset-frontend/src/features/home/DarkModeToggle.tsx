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
import { useCallback } from 'react';
import { css, useTheme } from '@apache-superset/core/theme';
import { ThemeMode } from '@apache-superset/core/theme';
import { t } from '@apache-superset/core/translation';
import { Icons, Tooltip } from '@superset-ui/core/components';
import { useThemeContext } from 'src/theme/ThemeProvider';

/**
 * One-click dark-mode toggle for the top navigation bar.
 *
 * Switches between Light and Dark theme modes. The icon reflects the action
 * the user is about to take (sun = switch to light, moon = switch to dark)
 * to mirror common toggle conventions across web apps.
 */
export const DarkModeToggle = () => {
  const theme = useTheme();
  const { themeMode, setThemeMode, canSetMode } = useThemeContext();

  const isDark = themeMode === ThemeMode.DARK;

  const handleToggle = useCallback(() => {
    setThemeMode(isDark ? ThemeMode.DEFAULT : ThemeMode.DARK);
  }, [isDark, setThemeMode]);

  if (!canSetMode()) return null;

  const label = isDark ? t('Switch to light mode') : t('Switch to dark mode');

  return (
    <Tooltip placement="bottom" title={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={isDark}
        data-test="dark-mode-toggle"
        onClick={handleToggle}
        css={css`
          background: transparent;
          border: 0;
          cursor: pointer;
          padding: 0 ${theme.sizeUnit * 2}px;
          height: 100%;
          color: inherit;
          display: inline-flex;
          align-items: center;

          &:hover,
          &:focus-visible {
            color: ${theme.colorPrimary};
          }
          &:focus {
            outline: none;
          }
          &:focus-visible {
            outline: 2px solid ${theme.colorPrimaryBorderHover};
            outline-offset: -2px;
          }
        `}
      >
        {isDark ? <Icons.SunOutlined /> : <Icons.MoonOutlined />}
      </button>
    </Tooltip>
  );
};

export default DarkModeToggle;
