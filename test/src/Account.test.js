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

import _ from 'underscore';
import account from '../../src/classes/Account';
import globals from '../../src/classes/Globals';
import api from '../../src/utils/api';
import conf from '../../src/classes/Conf';
import { local } from 'd3';

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
	api.mockClear()
	mockGet.mockClear();
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
				{
					status: 400,
					response: 'test'
				}
			)
			expect(fetch.mock.calls.length).toEqual(1);
		});

		test('resetPassword should return a an empty object if it is successful', async () => {
			const email = 'ben.ghostery+100@gmail.com';
			const response = await account.resetPassword(email);
			fetch.mockResponseOnce(
				{
					status: 200,
					response: 'test'
				}
			)
			expect(response).toEqual({});
		});

		test('resetPassword should return a JSONified object if it is unsuccessful', async () => {
			const email = 'ben.ghostery+100@gmail.com';
			const response = await account.resetPassword(email);
			console.log('response: ', response);
			fetch.mockResponseOnce(
				{
					status: 500,
					response: 'test'
				}
			)
			expect(response).toMatchObject(
				{
					status: 500,
					response: 'test'
				}
			);
		});
	})
});
