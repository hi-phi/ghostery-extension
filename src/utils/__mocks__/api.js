export const mockGet = jest.fn();
export const mockInit = jest.fn();
// const mock = jest.fn().mockImplementation(get => mockGet);

const mock = jest.fn().mockImplementation(() => ({
	get: mockGet,
	init: mockInit
}));

export default mock;
