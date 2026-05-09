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
import { ThemeMode, styled, css } from '@apache-superset/core/theme';
import { t } from '@apache-superset/core/translation';
import { Icons, Tooltip } from '@superset-ui/core/components';
import { useThemeContext } from 'src/theme/ThemeProvider';

const StyledToggleButton = styled.button`
  ${({ theme }) => css`
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${theme.colorText};
    padding: ${theme.sizeUnit}px ${theme.sizeUnit * 2}px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;

    &:hover,
    &:focus {
      color: ${theme.colorPrimary};
      outline: none;
    }

    &:focus-visible {
      outline: 1px solid ${theme.colorPrimaryBorder};
      outline-offset: -1px;
    }
  `}
`;

export function ThemeToggle() {
  const { setThemeMode, themeMode, canSetMode } = useThemeContext();

  if (!canSetMode()) {
    return null;
  }

  const isDark = themeMode === ThemeMode.DARK;
  const nextLabel = isDark ? t('Switch to light mode') : t('Switch to dark mode');

  const handleToggle = () => {
    setThemeMode(isDark ? ThemeMode.DEFAULT : ThemeMode.DARK);
  };

  return (
    <Tooltip title={nextLabel} placement="bottom">
      <StyledToggleButton
        type="button"
        data-test="theme-toggle"
        aria-label={nextLabel}
        aria-pressed={isDark}
        onClick={handleToggle}
      >
        {isDark ? <Icons.SunOutlined /> : <Icons.MoonOutlined />}
      </StyledToggleButton>
    </Tooltip>
  );
}

export default ThemeToggle;
