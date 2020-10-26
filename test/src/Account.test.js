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

import { mockGet, mockInit } from '../../src/utils/__mocks__/api';

// let mockGet = jest.fn();
// let mockInit = jest.fn();

import _ from 'underscore';
import account from '../../src/classes/Account';
import globals from '../../src/classes/Globals';
import api from '../../src/utils/api';
import conf from '../../src/classes/Conf';
import build from 'redux-object';
import normalize from 'json-api-normalizer';

jest.mock('../../src/utils/api', () => {
	return jest.fn().mockImplementation(() => { // Works and lets you check for constructor calls
		return {
			get: mockGet,
			init: mockInit
		};
	});
});

beforeEach(() => {
	fetch.resetMocks();
	api.mockClear();
	// api.get.mockClear();
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

	describe('testing getUser() success', () => {
		test('getUser() is not undefined', () => {
			expect(account.getUser).toBeDefined();
		});

		// get user object back

		// so have a user object as a response and compare again the expected result
		// mock the account file as well since we are mocking the

		// mock the account file and then make the call to the getUser() fun

		/** Test Plan -> the object of the test is to get the response of the getUser() method
			and compare against the data const that we have set. They should be equal
			*  first we create a data const that will contain the expected obj result
			*  mock the account file -> but only inside of this function so it does not affect the other tests
			*  set the userID like you were doing
			*  call the getUser()
			*  and the response should equal the data const
		**/

		test('getUser should use the userID that\'s on the account class', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			const response = await account._getUserID();
			expect(response).toEqual(userID);
		});

		test('getUser should make the api call with that ID', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			api.get = mockGet;
			mockGet.mockReturnValue({
				data: { id: 42 }
			});
			await account.getUser();
			expect(mockGet.mock.calls.length).toBe(1);
			expect(mockGet.mock.calls[0][0]).toBe('users');
			expect(mockGet.mock.calls[0][1]).toBe(userID);
		});

		test('getUser should take whatever the api call returns and set the conf object account user info', async () => {
			const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
			account._setAccountInfo(userID);
			api.get = mockGet;
			mockGet.mockReturnValue({
				data:  {
					attributes: {
						email: "ben.ghostery+100@gmail.com",
						emailValidated: false,
						firstName: "leury",
						id: userID,
						lastName: "rodriguez",
						scopes: null,
						stripeAccountId: "",
						stripeCustomerId: "",
						resolved: true
					},
					id: userID,
					type: 'users'
				}
			});
			const response = await account.getUser();
			expect(conf.account.user).toStrictEqual({
				email: "ben.ghostery+100@gmail.com",
				emailValidated: false,
				firstName: "leury",
				id: userID,
				lastName: "rodriguez",
				scopes: null,
				stripeAccountId: "",
				stripeCustomerId: "",
				resolved: true
			});
			expect(response).toStrictEqual({
				email: "ben.ghostery+100@gmail.com",
				emailValidated: false,
				firstName: "leury",
				id: userID,
				lastName: "rodriguez",
				scopes: null,
				stripeAccountId: "",
				stripeCustomerId: "",
				resolved: true
			});
		});

		test('getUser() fail', async () => {
			const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
			account._setAccountInfo(userID);
			api.get = mockGet;
			mockGet.mockRejectedValue();
			const response = await account.getUser();
			expect(response).toBe(null);
		});
	})

	describe('testing getUserSettings() success', () => {
		xtest('getUserSettings() is not undefined', () => {
			expect(account.getUserSettings).toBeDefined();
		});

		xtest('getUserSettings() success with a free account', async () => {
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

		xtest('getUserSettings() fail', () => {
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
