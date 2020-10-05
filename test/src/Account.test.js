/**
 * BugDb.js Unit Tests
 *
 * Ghostery Browser Extension
 * http://www.ghostery.com/
 *
 * Copyright 2020 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

import _ from 'underscore';
import account from '../../src/classes/Account';
import globals from '../../src/classes/Globals';
const { AUTH_SERVER } = globals;

jest.mock('../../src/utils/api');

beforeEach(() => {
	fetch.resetMocks();
});

describe('src/classes/Account.js', () => {
	describe('testing login()', () => {
		test('login() is not undefined', () => {
			expect(account.login).toBeDefined();
		});

		test('login() success', async () => {
			const email = 'ben.ghostery+85@gmail.com';
			const password = 'ghostery';
			fetch.mockResponseOnce(
				JSON.stringify({ response: {} }, { status: 200 })
			);
			const response = await account.login(email, password);
			expect(response).toEqual({});
			expect(fetch.mock.calls.length).toEqual(1);
		});

		test('login() fail', async () => {
			const email = 'ben.ghostery+85@gmail.com';
			const password = 'fakepassword';
			fetch.mockRejectOnce(
				JSON.stringify(
					{
						response: {
							status: 401
						}
					})
			);
			const response = await account.login(email, password)
				.then(() => resolve())
				.catch(error => {
					expect(error).toEqual(JSON.stringify({
						response: {
							status: 401
						}
					}));
				})
			expect(fetch.mock.calls.length).toEqual(1);
		});
	})
});
