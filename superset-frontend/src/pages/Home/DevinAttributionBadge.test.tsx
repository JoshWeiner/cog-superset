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
import { render, screen, userEvent } from 'spec/helpers/testing-library';
import DevinAttributionBadge, {
  DEVIN_BADGE_STORAGE_KEY,
} from 'src/pages/Home/DevinAttributionBadge';

beforeEach(() => {
  localStorage.removeItem(DEVIN_BADGE_STORAGE_KEY);
});

test('renders the badge with a link to devin.ai', () => {
  render(<DevinAttributionBadge />);
  expect(screen.getByTestId('devin-attribution-badge')).toBeInTheDocument();
  const link = screen.getByRole('link', { name: /devin/i });
  expect(link).toHaveAttribute('href', 'https://devin.ai');
});

test('hides the badge when the dismiss button is clicked', async () => {
  render(<DevinAttributionBadge />);
  expect(screen.getByTestId('devin-attribution-badge')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /close/i }));

  expect(
    screen.queryByTestId('devin-attribution-badge'),
  ).not.toBeInTheDocument();
  expect(localStorage.getItem(DEVIN_BADGE_STORAGE_KEY)).toBe('true');
});

test('does not render when previously dismissed', () => {
  localStorage.setItem(DEVIN_BADGE_STORAGE_KEY, 'true');
  render(<DevinAttributionBadge />);
  expect(
    screen.queryByTestId('devin-attribution-badge'),
  ).not.toBeInTheDocument();
});
