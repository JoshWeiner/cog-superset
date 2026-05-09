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
import { render, screen } from 'spec/helpers/testing-library';
import BuiltWithDevinBadge from 'src/features/home/BuiltWithDevinBadge';

test('renders the Built with Devin attribution text', () => {
  render(<BuiltWithDevinBadge />);
  expect(screen.getByText('Built with')).toBeInTheDocument();
  expect(screen.getByText('Devin')).toBeInTheDocument();
});

test('renders an external link to devin.ai with secure rel attributes', () => {
  render(<BuiltWithDevinBadge />);
  const link = screen.getByRole('link', { name: 'Built with Devin' });
  expect(link).toHaveAttribute('href', 'https://devin.ai');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});
