export const mockGet = jest.fn();
export const mockInit = jest.fn();
export const mockUpdate = jest.fn();
// const mock = jest.fn().mockImplementation(get => mockGet);

const mock = jest.fn().mockImplementation(() => ({
	get: mockGet,
	init: mockInit,
	update: mockUpdate,
}));

export default mock;
