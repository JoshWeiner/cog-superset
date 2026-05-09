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
import { useState } from 'react';
import { t } from '@apache-superset/core/translation';
import { styled } from '@apache-superset/core/theme';
import { Alert } from '@apache-superset/core/components';
import {
  dangerouslyGetItemDoNotUse,
  dangerouslySetItemDoNotUse,
} from 'src/utils/localStorageHelpers';

export const DEVIN_BADGE_STORAGE_KEY = 'superset.devinBadgeDismissed';

const BadgeContainer = styled.div`
  margin: ${({ theme }) => theme.sizeUnit * 2}px
    ${({ theme }) => theme.sizeUnit * 4}px 0;
`;

const isDismissed = (): boolean =>
  dangerouslyGetItemDoNotUse(DEVIN_BADGE_STORAGE_KEY, false) === true;

export const DevinAttributionBadge = () => {
  const [dismissed, setDismissed] = useState<boolean>(isDismissed);

  if (dismissed) {
    return null;
  }

  const handleClose = () => {
    dangerouslySetItemDoNotUse(DEVIN_BADGE_STORAGE_KEY, true);
    setDismissed(true);
  };

  return (
    <BadgeContainer data-test="devin-attribution-badge">
      <Alert type="info" showIcon closable onClose={handleClose}>
        {t('Built with')}{' '}
        <a href="https://devin.ai" target="_blank" rel="noopener noreferrer">
          {t('Devin')}
        </a>
      </Alert>
    </BadgeContainer>
  );
};

export default DevinAttributionBadge;
