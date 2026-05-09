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
import { t } from '@apache-superset/core/translation';
import { styled } from '@apache-superset/core/theme';

const BadgeContainer = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: center;
    padding: ${theme.sizeUnit * 4}px ${theme.sizeUnit * 4}px
      ${theme.sizeUnit * 6}px;
  `}
`;

const BadgeLink = styled.a`
  ${({ theme }) => `
    display: inline-flex;
    align-items: center;
    gap: ${theme.sizeUnit}px;
    padding: ${theme.sizeUnit}px ${theme.sizeUnit * 3}px;
    border: 1px solid ${theme.colorBorder};
    border-radius: ${theme.borderRadius}px;
    background: ${theme.colorBgContainer};
    color: ${theme.colorTextDescription};
    font-size: ${theme.fontSizeSM}px;
    line-height: 1;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s;

    &:hover,
    &:focus {
      color: ${theme.colorPrimary};
      border-color: ${theme.colorPrimary};
      text-decoration: none;
    }
  `}
`;

const BadgeLabel = styled.span`
  ${({ theme }) => `
    color: ${theme.colorTextDescription};
  `}
`;

const BadgeAttribution = styled.span`
  ${({ theme }) => `
    color: ${theme.colorText};
    font-weight: ${theme.fontWeightStrong};
  `}
`;

export default function BuiltWithDevinBadge() {
  return (
    <BadgeContainer data-test="built-with-devin-badge">
      <BadgeLink
        href="https://devin.ai"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('Built with Devin')}
      >
        <BadgeLabel>{t('Built with')}</BadgeLabel>
        <BadgeAttribution>{t('Devin')}</BadgeAttribution>
      </BadgeLink>
    </BadgeContainer>
  );
}
