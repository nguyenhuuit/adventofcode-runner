export type PromptResult = { language?: string; year?: string; day?: string; part?: string };

export type MockPrompt = jest.Mock<Promise<PromptResult>>;
