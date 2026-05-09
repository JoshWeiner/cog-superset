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
import { styled, ThemeMode } from '@apache-superset/core/theme';
import { t } from '@apache-superset/core/translation';
import { Tooltip } from '@superset-ui/core/components';
import { Icons } from '@superset-ui/core/components/Icons';

export interface DarkModeToggleProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const StyledToggleButton = styled.button`
  ${({ theme }) => `
    background: transparent;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colorIcon};
    padding: ${theme.sizeUnit}px ${theme.sizeUnit * 2}px;
    height: 100%;
    line-height: 1;

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
`;

export const DarkModeToggle = ({
  themeMode,
  setThemeMode,
}: DarkModeToggleProps) => {
  const isDark = themeMode === ThemeMode.DARK;
  const nextMode = isDark ? ThemeMode.DEFAULT : ThemeMode.DARK;
  const tooltipTitle = isDark
    ? t('Switch to light mode')
    : t('Switch to dark mode');

  return (
    <Tooltip title={tooltipTitle} placement="bottom">
      <StyledToggleButton
        type="button"
        aria-label={tooltipTitle}
        aria-pressed={isDark}
        data-test="dark-mode-toggle"
        onClick={() => setThemeMode(nextMode)}
      >
        {isDark ? <Icons.SunOutlined /> : <Icons.MoonOutlined />}
      </StyledToggleButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
