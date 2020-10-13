/**
 * Account.js Unit Tests
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

jest.mock('../../src/utils/api');

beforeEach(() => {
	fetch.resetMocks();
});

describe('src/classes/Account.js', () => {
	describe('testing login()', () => {
		// Test if undefined
		// Test if has 2 parameters
		// Test if returns a promise
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
	});

	describe('testing register()', () => {
		test('register() is not undefined', () => {
			expect(account.register).toBeDefined();
		});

		test('register() success', async () => {
			const email = 'ben.ghostery+85@gmail.com';
			const confirmEmail = 'ben.ghostery+85@gmail.com';
			const password = 'ghostery';
			const firstName = 'leury';
			const lastName = 'rodriguez';
			fetch.mockResponseOnce(
				JSON.stringify({ response: {} }, { status: 200 })
			);
			const response = await account.register(email, confirmEmail, password, firstName, lastName);
			expect(response).toEqual({});
			expect(fetch.mock.calls.length).toEqual(1);
		});

		test('register() fail', async () => {
			const email = 'ben.ghostery+85@gmail.com';
			const confirmEmail = 'ben.ghostery+85@gmail.com';
			const password = 'fakepassword';
			const firstName = 'leury';
			const lastName = 'rodriguez';
			fetch.mockRejectOnce(
				JSON.stringify(
					{
						response: {
							status: 401
						}
					})
			);
			const response = await account.register(email, confirmEmail, password, firstName, lastName)
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
	});

	describe('testing logout() success', () => {
		test('logout() is not undefined', () => {
			expect(account.logout).toBeDefined();
		});

		test('logout() success', async () => {
			fetch.mockResponseOnce(
				JSON.stringify({"_id": 1, "_label": undefined, "_result": undefined, "_state": undefined, "_subscribers": []})
			);
			const response = account.logout();
			expect(response).toEqual({"_id": 1, "_label": undefined, "_result": undefined, "_state": undefined, "_subscribers": []});
			expect(fetch.mock.calls.length).toEqual(0);
		});

		test('logout() fail', () => {
			fetch.mockRejectOnce(
				JSON.stringify(
					{
						response: {
							status: 401
						}
					})
			);
			const response = account.logout()
				.then(() => resolve())
				.catch(error => {
					expect(error).toEqual(JSON.stringify({
						response: {
							status: 401
						}
					}));
				})
			expect(fetch.mock.calls.length).toEqual(0);
		});
	})

	/// help
	describe('testing getUser() success', () => {
		xtest('getUser() is not undefined', () => {
			expect(account.getUser).toBeDefined();
		});

		xtest('getUser() success with a free account', async () => {
			fetch.mockResponseOnce(
				JSON.stringify({
					_id: 'd7999be5-210b-44f1-855d-3cf00ff579db',
					email: 'ben.ghostery+85@gmail.com',
					emailValidated: true,
					firstName: 'fsdg',
					lastName: 'fdsf',
					scopes: null,
					stripeAccountId: '',
					stripeCustomerId: '',
				})
			);
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			const response = await account.getUser();
			expect(response).toEqual(
				{
					_id: 'd7999be5-210b-44f1-855d-3cf00ff579db',
					email: 'ben.ghostery+85@gmail.com',
					emailValidated: true,
					firstName: 'fsdg',
					lastName: 'fdsf',
					scopes: null,
					stripeAccountId: '',
					stripeCustomerId: '',
				}
			);
			expect(fetch.mock.calls.length).toEqual(0);
		});

		xtest('getUser() fail', () => {
			fetch.mockRejectOnce(
				JSON.stringify(
					{
						response: {
							status: 401
						}
					})
			);
			const response = account.getUser()
				.then(() => resolve())
				.catch(error => {
					expect(error).toEqual(JSON.stringify({
						response: {
							status: 401
						}
					}));
				})
			expect(fetch.mock.calls.length).toEqual(0);
		});
	})

	describe('testing getUserSettings() success', () => {
		test('getUserSettings() is not undefined', () => {
			expect(account.getUserSettings).toBeDefined();
		});

		test('getUserSettings() success with a free account', async () => {
			fetch.mockResponseOnce(
				JSON.stringify({
					_id: 'd7999be5-210b-44f1-855d-3cf00ff579db',
					email: 'ben.ghostery+85@gmail.com',
					emailValidated: true,
					firstName: 'fsdg',
					lastName: 'fdsf',
					scopes: null,
					stripeAccountId: '',
					stripeCustomerId: '',
				})
			);
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			const response = await account.getUserSettings();
			expect(response).toEqual(
				{
					_id: 'd7999be5-210b-44f1-855d-3cf00ff579db',
					email: 'ben.ghostery+85@gmail.com',
					emailValidated: true,
					firstName: 'fsdg',
					lastName: 'fdsf',
					scopes: null,
					stripeAccountId: '',
					stripeCustomerId: '',
				}
			);
			expect(fetch.mock.calls.length).toEqual(0);
		});

		test('getUserSettings() fail', () => {
			fetch.mockRejectOnce(
				JSON.stringify(
					{
						response: {
							status: 401
						}
					})
			);
			const response = account.getUserSettings()
				.then(() => resolve())
				.catch(error => {
					expect(error).toEqual(JSON.stringify({
						response: {
							status: 401
						}
					}));
				})
			expect(fetch.mock.calls.length).toEqual(0);
		});
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
