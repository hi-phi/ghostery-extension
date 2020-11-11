export const mockTrigger = jest.fn();
// const mock = jest.fn().mockImplementation(get => mockGet);

const mock = jest.fn().mockImplementation(() => ({
	trigger: mockTrigger,
}));

export default mock;
