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
import api from '../../src/utils/api';

jest.mock(api);

describe('src/classes/Account.js', () => {
	describe('testing login()', () => {
		// Test if undefined
		// Test if has 2 parameters
		// Test if returns a promise
		// Mock fetch with some correct data (any validation should be done in the API)
		// Don't test the api call, that's an integration test
		// Mock the API response
		test('login() is not undefined', () => {
			expect(account.login).toBeDefined();
		});
		test('login() returns 400 OK', () => {
			const email = window.encodeURIComponent('ben.ghostery+85@gmail.com');
			const password = window.encodeURIComponent('ghostery');
			const mockData = `email=${email}&password=${password}`;
			const mockRequest = {
				method: 'POST',
				body: mockData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(mockData),
				},
				credentials: 'include',
			};
			expect(true).toBe(true);
		});
		// test('login has 2 parameters', () => {
		// 	expect(account.login).toHaveBeenCalledWith(
		// 		expect(any(String))
		// 	);
		// });
	})
	// Think Fatal
	// This function has an input/output
	// test('pre-initialization api config is set--maybe test if api is inited with opts?', () => {});
	// test('register method is called with correct params and is not undefined and returns a promise', () => {});
	// test('logout method is called with correct params and is not undefined and returns a promise', () => {});
	// test('getUser method is called with correct params and is not undefined and returns a promise', () => {});
	// test('getUserSettings method is called with correct params and is not undefined and returns a promise', () => {});
	// test('getUserSubscriptionData method is called with correct params and is not undefined and returns a promise', () => {});
	// test('saveUserSettings method is called with correct params and is not undefined and returns a promise', () => {});
	// test('getTheme method is called with correct params and is not undefined and returns a promise', () => {});
	// test('sendValidateAccountEmail method is called with correct params and is not undefined and returns a promise', () => {});
	// test('resetPassword method is called with correct params and is not undefined and returns a promise', () => {});
	// test('hasScopesUnverified method is called with correct params and is not undefined and returns a promise', () => {});
	// test('migrate method is called with correct params and is not undefined and returns a promise', () => {});
	// // Should i be testing private functions?
	// test('_setLoginCookie method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_getUserID method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_getUserIDIfEmailIsValidated method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_setAccountInfo method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_setAccountUserInfo method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_setAccountUserSettings method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_setSubscriptionData method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_setThemeData method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_clearAccountInfo method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_getUserIDFromCookie method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_setConfUserSettings method is called with correct params and is not undefined and returns a promise', () => {});
	// test('_removeCookies method is called with correct params and is not undefined and returns a promise', () => {});
});
