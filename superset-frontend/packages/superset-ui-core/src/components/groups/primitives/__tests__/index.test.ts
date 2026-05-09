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

import {
  Button,
  ButtonGroup,
  Badge,
  Label,
  DatasetTypeLabel,
  PublishedLabel,
  Divider,
  Typography,
  Flex,
  Grid,
  Row,
  Col,
  Avatar,
  AvatarGroup,
  Card,
  IconButton,
  ActionButton,
  CertifiedBadge,
  FaveStar,
} from '../index';

test('primitives barrel exposes expected primitive components', () => {
  expect(Button).toBeDefined();
  expect(ButtonGroup).toBeDefined();
  expect(Badge).toBeDefined();
  expect(Label).toBeDefined();
  expect(DatasetTypeLabel).toBeDefined();
  expect(PublishedLabel).toBeDefined();
  expect(Divider).toBeDefined();
  expect(Typography).toBeDefined();
  expect(Flex).toBeDefined();
  expect(Grid).toBeDefined();
  expect(Row).toBeDefined();
  expect(Col).toBeDefined();
  expect(Avatar).toBeDefined();
  expect(AvatarGroup).toBeDefined();
  expect(Card).toBeDefined();
  expect(IconButton).toBeDefined();
  expect(ActionButton).toBeDefined();
  expect(CertifiedBadge).toBeDefined();
  expect(FaveStar).toBeDefined();
});
