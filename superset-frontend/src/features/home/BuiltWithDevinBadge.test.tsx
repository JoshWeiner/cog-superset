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
import BuiltWithDevinBadge, {
  BUILT_WITH_DEVIN_DISMISSED_KEY,
} from './BuiltWithDevinBadge';

beforeEach(() => {
  localStorage.removeItem(BUILT_WITH_DEVIN_DISMISSED_KEY);
});

test('renders a Built with Devin badge linking to devin.ai', () => {
  render(<BuiltWithDevinBadge />);

  const link = screen.getByRole('link', { name: /devin/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', 'https://devin.ai');
  expect(screen.getByText(/built with/i)).toBeInTheDocument();
});

test('hides the badge after the dismiss button is clicked and persists in localStorage', () => {
  const { container } = render(<BuiltWithDevinBadge />);

  expect(screen.getByText(/built with/i)).toBeInTheDocument();

  const closeButton = container.querySelector(
    '.ant-alert-close-icon',
  ) as HTMLElement;
  expect(closeButton).not.toBeNull();
  userEvent.click(closeButton);

  expect(screen.queryByText(/built with/i)).not.toBeInTheDocument();
  expect(localStorage.getItem(BUILT_WITH_DEVIN_DISMISSED_KEY)).toBe('true');
});

test('does not render the badge when previously dismissed', () => {
  localStorage.setItem(BUILT_WITH_DEVIN_DISMISSED_KEY, 'true');

  render(<BuiltWithDevinBadge />);

  expect(screen.queryByText(/built with/i)).not.toBeInTheDocument();
});
