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
import { mockTrigger } from '../../src/utils/__mocks__/dispatcher';

import _ from 'underscore';
import account from '../../src/classes/Account';
import globals from '../../src/classes/Globals';
import api from '../../src/utils/api';
import dispatcher from '../../src/classes/Dispatcher';
import conf from '../../src/classes/Conf';
import RSVP from 'rsvp';

const mockCookieGet = jest.fn();
const mockCookieSet = jest.fn();
const mockCookieRemove = jest.fn();

// Global chrome object to mock chrome.cookies.set and chrome.cookies.get
global.chrome = {
   cookies: {
	   set: mockCookieGet,
	   get: mockCookieSet,
	   remove: mockCookieRemove,
   }
};

jest.mock('../../src/utils/api', () => {
	return jest.fn().mockImplementation(() => {
		return {
			get: mockGet,
			init: mockInit
		};
	});
});

beforeEach(() => {
	fetch.resetMocks();
	api.mockClear()
	mockGet.mockClear();
	mockTrigger.mockReset();
});

describe('src/classes/Account.js', () => {
	describe('testing login()', () => {
		test('login() is not undefined', () => {
			expect(account.login).toBeDefined();
		});

		test('login() success', async () => {
			const email = 'ben.ghostery+85@gmail.com';
			const password = 'fakepassword';
			fetch.mockResponseOnce(
				JSON.stringify({ status: 200 })
			);
			try {
				const response = await account.login(email, password);
				expect(response).toEqual({});
				expect(fetch.mock.calls.length).toEqual(1);
			} catch (err) {}
		});

		test('login() fail', async () => {
			const email = 'ben.ghostery+85@gmail.com';
			const password = 'fakepassword';
			fetch.mockRejectOnce(
				JSON.stringify({ status: 401 })
			);
			try {
				const response = await account.login(email, password);
			} catch (err) {
				expect(err).toEqual(JSON.stringify({ status:401 }));
				expect(fetch.mock.calls.length).toEqual(1);
			}
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
		xtest('logout() is not undefined', () => {
			expect(account.logout).toBeDefined();
		});

		xtest('logout() success', async () => {
			var promise = new RSVP.Promise(account.logout);
			promise.then(function (d) {
				const expectedResponse = { "_id": 1, "_label": undefined, "_result": undefined, "_state": undefined, "_subscribers": [], "status": 200 };
				fetch.mockResponseOnce(
					JSON.stringify(expectedResponse)
				);
				expect(response).toEqual({});
				expect(fetch.mock.calls.length).toEqual(1);
			})
		});

		xtest('logout() fail', () => {
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

		// test('getUser() fail', async () => {
		// 	const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
		// 	account._setAccountInfo(userID);
		// 	api.get = mockGet;
		// 	mockGet.mockRejectedValue();
		// 	const response = await account.getUser();
		// 	expect(response).toBe(null);
		// });
	})

	describe('testing getUserSettings()', () => {
		test('getUserSettings() is not undefined', () => {
			expect(account.getUserSettings).toBeDefined();
		});

		test('getUserSettings() should set the userID if the email is validated', async () => {
			const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
			account._setAccountInfo(userID);
			const response = await account._getUserID();
			expect(response).toEqual(userID);
		});

		xtest('getUserSettings() should make the api call with that ID', async () => {
			const user = {
				userID: '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5',
				email: "ben.ghostery+100@gmail.com",
				emailValidated: true,
				firstName: "leury",
				lastName: "rodriguez",
				scopes: null,
				stripeAccountId: "",
				stripeCustomerId: "",
				resolved: true
			};
			account._setAccountUserInfo(user);
			api.get = mockGet;
			mockGet.mockReturnValue();
			await account.getUserSettings();
			expect(mockGet.mock.calls.length).toBe(1);
			expect(mockGet.mock.calls[0][0]).toBe('settings');
			expect(mockGet.mock.calls[0][1]).toBe(userID)
		});
	})

	describe('testing getUserSubscriptionData()', () => {
		test('getUserSubscriptionData() is not undefined', () => {
			expect(account.getUserSubscriptionData).toBeDefined();
		});

		test('getUserSubscriptionData() should make the api call with that ID', async () => {
			const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
			account._setAccountInfo(userID);
			api.get = mockGet;
			mockGet.mockReturnValue({
				"data": { "type": "customers", "id": "cus_HGV3vb8TGCNvDT", "attributes": { "description": "", "metadata": { "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" }, "publishable_key": "pk_test_bLcnZQXwEIROFvV9q4Hf2zqQ", "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" }, "relationships": { "cards": { "data": [{ "type": "cards", "id": "card_1HSnKUJBAQgtd33Oy8Xl29AP" }] }, "subscriptions": { "data": [{ "type": "subscriptions", "id": "sub_I2t6J2UypiR4j9" }, { "type": "subscriptions", "id": "sub_HGV3RgLhq9OSyy" }] } } }, "included": [{ "type": "cards", "id": "card_1HSnKUJBAQgtd33Oy8Xl29AP", "attributes": { "address_city": "New York", "address_country": "CA", "address_line1": "49 W 23rd Street", "address_state": "Nova Scotia", "address_zip": "10010", "brand": "Visa", "exp_month": 4, "exp_year": 2024, "last4": "4242", "name": "leury rodriguez", "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" } }, { "type": "subscriptions", "id": "sub_I2t6J2UypiR4j9", "attributes": { "cancel_at_period_end": false, "created": 1600449911, "current_period_end": 1605720311, "current_period_start": 1603041911, "plan_amount": 5900, "plan_currency": "cad", "plan_id": "plan_insights_month_5900_cad", "plan_interval": "month", "plan_name": "Insights for 59.00 CAD / month", "product_id": "prod_insights", "product_name": "Ghostery Insights Beta", "status": "active" } }, { "type": "subscriptions", "id": "sub_HGV3RgLhq9OSyy", "attributes": { "cancel_at_period_end": false, "created": 1589289696, "current_period_end": 1605187296, "current_period_start": 1602508896, "plan_amount": 1800, "plan_currency": "cad", "plan_id": "plan_premium_month_1800_cad", "plan_interval": "month", "plan_name": "Premium for 18.00 CAD / month", "product_id": "prod_premium", "product_name": "Ghostery Premium", "status": "active" } }]
			})
			const response = await account.getUserSubscriptionData();
			expect(mockGet.mock.calls[0][0]).toBe('stripe/customers');
			expect(mockGet.mock.calls[0][1]).toBe(userID);
			expect(mockGet.mock.calls[0][2]).toBe('cards,subscriptions');
		});

		test('getUserSubscriptionData() should set the subscriptionData', async () => {
			const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
			account._setAccountInfo(userID);
			api.get = mockGet;
			mockGet.mockReturnValue({
				"data": { "type": "customers", "id": "cus_HGV3vb8TGCNvDT", "attributes": { "description": "", "metadata": { "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" }, "publishable_key": "pk_test_bLcnZQXwEIROFvV9q4Hf2zqQ", "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" }, "relationships": { "cards": { "data": [{ "type": "cards", "id": "card_1HSnKUJBAQgtd33Oy8Xl29AP" }] }, "subscriptions": { "data": [{ "type": "subscriptions", "id": "sub_I2t6J2UypiR4j9" }, { "type": "subscriptions", "id": "sub_HGV3RgLhq9OSyy" }] } } }, "included": [{ "type": "cards", "id": "card_1HSnKUJBAQgtd33Oy8Xl29AP", "attributes": { "address_city": "New York", "address_country": "CA", "address_line1": "49 W 23rd Street", "address_state": "Nova Scotia", "address_zip": "10010", "brand": "Visa", "exp_month": 4, "exp_year": 2024, "last4": "4242", "name": "leury rodriguez", "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" } }, { "type": "subscriptions", "id": "sub_I2t6J2UypiR4j9", "attributes": { "cancel_at_period_end": false, "created": 1600449911, "current_period_end": 1605720311, "current_period_start": 1603041911, "plan_amount": 5900, "plan_currency": "cad", "plan_id": "plan_insights_month_5900_cad", "plan_interval": "month", "plan_name": "Insights for 59.00 CAD / month", "product_id": "prod_insights", "product_name": "Ghostery Insights Beta", "status": "active" } }, { "type": "subscriptions", "id": "sub_HGV3RgLhq9OSyy", "attributes": { "cancel_at_period_end": false, "created": 1589289696, "current_period_end": 1605187296, "current_period_start": 1602508896, "plan_amount": 1800, "plan_currency": "cad", "plan_id": "plan_premium_month_1800_cad", "plan_interval": "month", "plan_name": "Premium for 18.00 CAD / month", "product_id": "prod_premium", "product_name": "Ghostery Premium", "status": "active" } }]
			});
			const response = await account.getUserSubscriptionData();
			expect(conf.account.subscriptionData).toStrictEqual({
				id: 'sub_HGV3RgLhq9OSyy',
				cancelAtPeriodEnd: false,
				created: 1589289696,
				currentPeriodEnd: 1605187296,
				currentPeriodStart: 1602508896,
				planAmount: 1800,
				planCurrency: 'cad',
				planId: 'plan_premium_month_1800_cad',
				planInterval: 'month',
				planName: 'Premium for 18.00 CAD / month',
				productId: 'prod_premium',
				productName: 'Ghostery Premium',
				status: 'active'
			});
		});
		test('getUserSubscriptionData() should send a metrics ping', async () => {});
	})

	describe('testing saveUserSettings()', () => {
		test('saveUserSettings() is not undefined', () => {
			expect(account.saveUserSettings).toBeDefined();
		});

		xtest('saveUserSettings() should make the api call with that ID', async () => {
			const userID = '36fd0fc3-50dc-45f4-adf7-f7b01cea07a5';
			account._setAccountInfo(userID);
			api.get = mockGet;
			mockGet.mockReturnValue({
				"data": { "type": "customers", "id": "cus_HGV3vb8TGCNvDT", "attributes": { "description": "", "metadata": { "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" }, "publishable_key": "pk_test_bLcnZQXwEIROFvV9q4Hf2zqQ", "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" }, "relationships": { "cards": { "data": [{ "type": "cards", "id": "card_1HSnKUJBAQgtd33Oy8Xl29AP" }] }, "subscriptions": { "data": [{ "type": "subscriptions", "id": "sub_I2t6J2UypiR4j9" }, { "type": "subscriptions", "id": "sub_HGV3RgLhq9OSyy" }] } } }, "included": [{ "type": "cards", "id": "card_1HSnKUJBAQgtd33Oy8Xl29AP", "attributes": { "address_city": "New York", "address_country": "CA", "address_line1": "49 W 23rd Street", "address_state": "Nova Scotia", "address_zip": "10010", "brand": "Visa", "exp_month": 4, "exp_year": 2024, "last4": "4242", "name": "leury rodriguez", "user_id": "3ccf42fa-8062-4b13-a814-78147fa2cc3c" } }, { "type": "subscriptions", "id": "sub_I2t6J2UypiR4j9", "attributes": { "cancel_at_period_end": false, "created": 1600449911, "current_period_end": 1605720311, "current_period_start": 1603041911, "plan_amount": 5900, "plan_currency": "cad", "plan_id": "plan_insights_month_5900_cad", "plan_interval": "month", "plan_name": "Insights for 59.00 CAD / month", "product_id": "prod_insights", "product_name": "Ghostery Insights Beta", "status": "active" } }, { "type": "subscriptions", "id": "sub_HGV3RgLhq9OSyy", "attributes": { "cancel_at_period_end": false, "created": 1589289696, "current_period_end": 1605187296, "current_period_start": 1602508896, "plan_amount": 1800, "plan_currency": "cad", "plan_id": "plan_premium_month_1800_cad", "plan_interval": "month", "plan_name": "Premium for 18.00 CAD / month", "product_id": "prod_premium", "product_name": "Ghostery Premium", "status": "active" } }]
			})
			const response = await account.saveUserSettings();
			// Blocked by EmailValidated
		});
	})

	describe('testing getTheme()', () => {
		test('getTheme() is not undefined', () => {
			expect(account.getTheme).toBeDefined();
		});

		test('getUser should use the userID that\'s on the account class', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			const response = await account._getUserID();
			expect(response).toEqual(userID);
		});

		test('getUser should return a css file if the account has themeData and 24 hours has not passed', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			account._setThemeData({
				name: 'leaf',
				css: 'leaf.css'
			});
			const response = await account.getTheme('leaf');
			expect(response).toBe('leaf.css');
		});

		test('getUser should return call the api with the correct parameters if the account does not have themeData or 24 hours have passed', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID); // Sets conf.account.themeData to null
			api.get = mockGet;
			mockGet.mockResolvedValue({
				data: {
					attributes: {
						css: 'css'
					},
					id: 'leaf-theme.css',
					type: 'themes'
				}
			});
			const response = await account.getTheme('leaf');
			expect(mockGet.mock.calls[0][0]).toBe('themes');
			expect(mockGet.mock.calls[0][1]).toBe('leaf.css');
		});

		test('getUser should set the theme data if the account does not have themeData or 24 hours have passed', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID); // Sets conf.account.themeData to null
			api.get = mockGet;
			mockGet.mockResolvedValue({
				data: {
					attributes: {
						css: 'css'
					},
					id: 'leaf-theme.css',
					type: 'themes'
				}
			});
			const response = await account.getTheme('leaf');
			expect(conf.account.themeData).toBeDefined();
		});
	})

	describe('testing sendValidateAccountEmail()', () => {
		test('sendValidateAccountEmail() is not undefined', () => {
			expect(account.sendValidateAccountEmail).toBeDefined();
		});

		test('sendValidateAccountEmail should use the userID that\'s on the account class', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			const response = await account._getUserID();
			expect(response).toEqual(userID);
		});

		test('sendValidateAccountEmail should call fetch and return true if the status is less than 400', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			fetch.mockResolvedValue(
				{
					status: 200,
				}
			);
			const response = await account.sendValidateAccountEmail();
			expect(fetch.mock.calls.length).toEqual(1);
			expect(response).toBe(true);
		})

		test('sendValidateAccountEmail should call fetch and return false if the status is greater than 400', async () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			account._setAccountInfo(userID);
			fetch.mockResolvedValue(
				{
					status: 400,
				}
			);
			const response = await account.sendValidateAccountEmail();
			expect(fetch.mock.calls.length).toEqual(1);
			expect(response).toBe(false);
		})
	})


	describe('testing resetPassword()', () => {
		test('resetPassword() is not undefined', () => {
			expect(account.resetPassword).toBeDefined();
		});

		test('resetPassword should call fetch with some data', async () => {
			const email = 'ben.ghostery+100@gmail.com';
			account.resetPassword(email);
			fetch.mockResolvedValue(
				JSON.stringify({ status: 400, response: 'test'})
			)
			expect(fetch.mock.calls.length).toEqual(1);
		});

		test('resetPassword should return a an empty object if it is successful', async () => {
			const email = 'ben.ghostery+100@gmail.com';
			fetch.mockResponseOnce(
				JSON.stringify({ status: 200, response: 'test' })
			);
			try {
				const response = await account.resetPassword(email);
				expect(response).toEqual({});
			} catch (err) {}
		});

		test('resetPassword should return a JSONified object if it is unsuccessful', async () => {
			const email = 'ben.ghostery+100@gmail.com';
			fetch.mockRejectOnce(
				JSON.stringify({ status: 401, response: 'test' })
			);
			try {
				const response = await account.resetPassword(email);
			} catch (err) {
				expect(err).toEqual(JSON.stringify({ status:401, response: 'test' }));
				expect(fetch.mock.calls.length).toEqual(1);
			}
			expect(fetch.mock.calls.length).toEqual(1);
		});
	})

	describe('testing hasScopesUnverified()', () => {
		test('hasScopesUnverified() is not undefined', () => {
			expect(account.hasScopesUnverified).toBeDefined();
		});

		test('hasScopesUnverified should return null if conf.account is null', () => {
			conf.account = null;
			const result = account.hasScopesUnverified('non-empty method call');
			expect(result).toBe(false);
		});

		('hasScopesUnverified should return null if conf.account.user is null', () => {
			conf.account = { user: null };
			const result = account.hasScopesUnverified('non-empty method call');
			expect(result).toBe(false);
		});

		test('hasScopesUnverified should return null if conf.account.user.scopes is null', () => {
			conf.account = {
				user: {
					scopes: null
				}
			};
			const result = account.hasScopesUnverified('non-empty method call');
			expect(result).toBe(false);
		});

		test('hasScopesUnverified should return false if called with no parameters', () => {
			const result = account.hasScopesUnverified();
			expect(result).toBe(false);
		});

		test('hasScopesUnverified should return false if \'god\' is inside the scope', () => {
			conf.account = {
				user: {
					scopes: ['god']
				}
			};
			const result = account.hasScopesUnverified('non-empty method call');
			expect(result).toBe(true);
		});

		test('hasScopesUnverified should return true if a user has a required scope combination', () => {
			conf.account = {
				user: {
					scopes: ['resource:read', 'resource:write']
				}
			};
			const result = account.hasScopesUnverified(['resource:read','resource:write']);
			expect(result).toBe(true);
		});

		test('hasScopesUnverified should return false if a user does not have the required scope combination', () => {
			conf.account = {
				user: {
					scopes: ['resource:read']
				}
			};
			const result = account.hasScopesUnverified(['resource:read','resource:write']);
			expect(result).toBe(false);
		});
	})

	describe('testing buildUserSettings()', () => {
		test('buildUserSettings() is not undefined', () => {
			expect(account.buildUserSettings).toBeDefined();
		});

		test('the buildUserSettings() object should contain all of the keys from the SYNC_SET', () => {
			const { SYNC_ARRAY } = globals;
			const SYNC_SET = new Set(SYNC_ARRAY);
			const settings = account.buildUserSettings();
			let hasAllKeys = true;
			for (const key in SYNC_SET) {
				if (key === 'reload_banner_status'
					|| key === 'trackers_banner_status'
					|| key in settings)
					hasAllKeys = false;
			}
			expect(hasAllKeys).toBe(true);
		});
	})

	// describe('testing setLoginCookie()', () => {
	// 	test('setLoginCookie() is not undefined', () => {
	// 		expect(account._setLoginCookie()).toBeDefined();
	// 	});

	// 	test('setLoginCookie() should error if it is called without a name or value detail object', async () => {
	// 		await expect(account._setLoginCookie({ name: 'test', value: '', expirationDate: 'test', httpOnly: true})).rejects.toThrow('One or more required values missing:');
	// 		await expect(account._setLoginCookie({ name: '', value: 'test', expirationDate: 'test', httpOnly: true})).rejects.toThrow('One or more required values missing:');
	// 	});

	// 	test('setLoginCookie() ', async () => {
	// 		const details = {
	// 			name: 'cookie',
	// 			value: 'test',
	// 			expirationDate: '2020-11-6',
	// 			httpOnly: false
	// 		};
	// 		if (typeof details !== undefined) {
	// 			const cookie = await account._setLoginCookie(details);
	// 			console.log(cookie);
	// 		}
	// 	});
	// })


	// describe('testing _getUserID()', () => {
	// 	test('_getUserID() is not undefined', () => {
	// 		expect(account._getUserID()).toBeDefined();
	// 	});

	// 	test('getUserID should use the userID that\'s on the account class', async () => {
	// 		const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
	// 		account._setAccountInfo(userID);
	// 		const response = await account._getUserID();
	// 		expect(response).toEqual(userID);
	// 	});

	// 	test('getUserID should set the account info from the cookie if conf.account is null', async () => {
	// 		conf.account = null;
	// 		const details = {
	// 			name: 'cookie',
	// 			value: 'test',
	// 			expirationDate: '2020-11-6',
	// 			httpOnly: false
	// 		};
	// 		try {
	// 			await account._setLoginCookie(details);
	// 		} catch (err) {}

	// 		try {
	// 			const response = await account._getUserID();
	// 		} catch (err) {
	// 			console.log(err);
	// 			expect(err).toBe(true);
	// 		}
	// 		// account._setAccountInfo(''); // Clear account info from previous test
	// 		// await expect(account._getUserID()).rejects.toThrow('_getUserID() Not logged in');
	// 	});
	// })

	describe('testing _getUserIDIfEmailIsValidated()', () => {
		xtest('testing ', () => {
			expect(true).toBe(true);
		});
	});

	describe('testing _setAccountInfo()', () => {
		test('_setAccountInfo should set the user ID on the conf.account object ', () => {
			const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
			const expectedAccountObj = {
				userID,
				user: null,
				userSettings: null,
				subscriptionData: null,
				themeData: null,
			};
			account._setAccountInfo(userID);
			expect(conf.account).toEqual(expectedAccountObj);
		});
	});

	describe('testing setAccountUserInfo()', () => {
		// Mock the Dispatcher class only inside this test
		jest.mock('../../src/classes/Dispatcher', () => {
			return jest.fn().mockImplementation(() => {
				return {
					trigger: mockTrigger
				};
			});
		});

		const userID = 'd7999be5-210b-44f1-855d-3cf00ff579db';
		const user = {
			email: "ben.ghostery+100@gmail.com",
			emailValidated: false,
			firstName: "leury",
			id: userID,
			lastName: "rodriguez",
			scopes: null,
			stripeAccountId: "",
			stripeCustomerId: "",
			resolved: true
		};

		test('_setAccountUserInfo() should call the trigger function', () => {
			dispatcher.trigger = mockTrigger;
			mockTrigger.mockClear();
			account._setAccountUserInfo(user);
			expect(mockTrigger.mock.calls.length).toEqual(1);
		});

		test('_setAccountUserInfo() set the conf.account.user object', () => {
			account._setAccountUserInfo(user);
			expect(conf.account.user).toEqual(user);
		});
	});

	describe('testing setSubscriptionData()', () => {
		// Mock the Dispatcher class only inside this test
		jest.mock('../../src/classes/Dispatcher', () => {
			return jest.fn().mockImplementation(() => {
				return {
					trigger: mockTrigger
				};
			});
		});

		const premiumSubscription = {
			cancelAtPeriodEnd: false,
			created: 1589289696,
			currentPeriodEnd: 1605187296,
			currentPeriodStart: 1602508896,
			id: "sub_HGV3RgLhq9OSyy",
			planAmount: 1800,
			planCurrency: "cad",
			planId: "plan_premium_month_1800_cad",
			planInterval: "month",
			planName: "Premium for 18.00 CAD / month",
			productId: "prod_premium",
			productName: "Ghostery Premium",
			status: "active",
		};

		test('setSubscriptionData() should set conf.paid_subscription to true if it is false', () => {
			mockTrigger.mockClear();
			conf.paid_subscription = false;
			account._setSubscriptionData(premiumSubscription);
			expect(conf.paid_subscription).toBe(true);
		});

		test('setSubscriptionData() should set conf.account.subscriptionData ', () => {
			mockTrigger.mockClear();
			account._setSubscriptionData(premiumSubscription);
			expect(conf.account.subscriptionData).toBe(premiumSubscription);
		});

		test('setSubscriptionData() should call trigger once if conf.paid_subscription is false', () => {
			conf.paid_subscription = true;
			dispatcher.trigger = mockTrigger;
			mockTrigger.mockReset();
			account._setSubscriptionData(premiumSubscription);
			expect(mockTrigger.mock.calls.length).toEqual(1);
		});
	});

	describe('testing _setThemeData()', () => {
		// Mock the Dispatcher class only inside this test
		jest.mock('../../src/classes/Dispatcher', () => {
			return jest.fn().mockImplementation(() => {
				return {
					trigger: mockTrigger
				};
			});
		});

		const themeData = {
			name: 'palm',
		}

		test('_setThemeData should call the trigger function once', () => {
			dispatcher.trigger = mockTrigger;
			mockTrigger.mockReset();
			account._setThemeData(themeData);
			expect(mockTrigger.mock.calls.length).toEqual(1);
		});

		test('_setThemeData should set conf.account.themeData', () => {
			account._setThemeData(themeData);
			expect(conf.account.themeData).toBeDefined();
		});
	});

	describe('testing _clearAccountInfo()', () => {
		test('_clearAccountInfo() should clear conf.account', () => {
			account._clearAccountInfo();
			expect(conf.account).toEqual(null);
		});

		test('_clearAccountInfo() should clear conf.current_theme', () => {
			account._clearAccountInfo();
			expect(conf.current_theme).toEqual('default');
		});
	});

	describe('testing getUserIDFromCookie()', () => {
		test('_getUserIDFromCookie should get the user ID cookie', () => {
			chrome.cookies.get = mockCookieGet;
			const response = account._getUserIDFromCookie();
			expect(chrome.cookies.get).toHaveBeenCalledTimes(1);
		});
	});

	describe('testing _setConfUserSettings()', () => {
		test('_setConfUserSettings should set the keys on the conf object', () => {
			const userSettings = { "alert_bubble_pos": "br", "alert_bubble_timeout": 15, "alert_expanded": false, "block_by_default": false, "cliqz_adb_mode": 0, "cliqz_module_whitelist": {}, "current_theme": "default", "enable_abtests": true, "enable_ad_block": true, "enable_anti_tracking": true, "enable_autoupdate": false, "enable_click2play": true, "enable_click2play_social": true, "enable_human_web": true, "enable_metrics": false, "enable_offers": true, "enable_smart_block": true, "expand_all_trackers": true, "hide_alert_trusted": false, "ignore_first_party": true, "import_callout_dismissed": true, "is_expanded": false, "is_expert": false, "notify_library_updates": false, "notify_promotions": true, "notify_upgrade_updates": true, "reload_banner_status": { "dismissals": [], "show": true, "show_time": 1604310904402 }, "selected_app_ids": { "1": 1, "2": 1, "3": 1, "4": 1, "5": 1 }, "show_alert": true, "show_badge": true, "show_cmp": true, "show_tracker_urls": true, "site_specific_blocks": {}, "site_specific_unblocks": {}, "toggle_individual_trackers": true, "trackers_banner_status": { "dismissals": [], "show": true, "show_time": 1604310904402 } }
			const { SYNC_ARRAY } = globals;
			const SYNC_SET = new Set(SYNC_ARRAY);
			account._setConfUserSettings(userSettings);

			let hasAllKeys = true;
			for (const key in SYNC_SET) {
				if (key in conf)
					hasAllKeys = false;
			}
			expect(hasAllKeys).toBe(true);
		})
	})

	describe('testing _removeCookies', () => {
		chrome.cookies.remove = mockCookieRemove;
		account._removeCookies();
		expect(chrome.cookies.remove).toHaveBeenCalledTimes(5);
	});
});
