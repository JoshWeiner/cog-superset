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
import { Alert } from '@apache-superset/core/components';
import { styled } from '@apache-superset/core/theme';
import {
  dangerouslyGetItemDoNotUse,
  dangerouslySetItemDoNotUse,
} from 'src/utils/localStorageHelpers';

export const BUILT_WITH_DEVIN_DISMISSED_KEY = 'superset.devinBadgeDismissed';

const BadgeWrapper = styled.div`
  margin: ${({ theme }) => theme.sizeUnit * 4}px
    ${({ theme }) => theme.sizeUnit * 4}px 0;
`;

export default function BuiltWithDevinBadge() {
  const [dismissed, setDismissed] = useState<boolean>(() =>
    Boolean(dangerouslyGetItemDoNotUse(BUILT_WITH_DEVIN_DISMISSED_KEY, false)),
  );

  if (dismissed) {
    return null;
  }

  const handleClose = () => {
    dangerouslySetItemDoNotUse(BUILT_WITH_DEVIN_DISMISSED_KEY, true);
    setDismissed(true);
  };

  return (
    <BadgeWrapper data-test="built-with-devin-badge">
      <Alert
        type="info"
        closable
        onClose={handleClose}
        message={
          <span>
            Built with{' '}
            <a
              href="https://devin.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Devin
            </a>
          </span>
        }
      />
    </BadgeWrapper>
  );
}
