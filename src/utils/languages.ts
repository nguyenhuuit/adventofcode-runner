export const EXTENSIONS: { [key: string]: string } = {
  javascript: 'mjs',
  python: 'py',
  java: 'java',
  go: 'go',
};

const PYTHON_TEMPLATE = `def solution(input):
  pass
`;

const JAVASCRIPT_TEMPLATE = `export const solution = input => {
  return null;
}
`;

const JAVA_TEMPLATE = `class Solution {
  public static String solve(String input) {
    return null;
  }
}`;

const GO_TEMPLATE = (state: AppState) =>
  `package main

func Part${state.part}(input string) interface{} {
	return nil
}
`;

export const TEMPLATES: Record<string, string | Function> = {
  javascript: JAVASCRIPT_TEMPLATE,
  python: PYTHON_TEMPLATE,
  java: JAVA_TEMPLATE,
  go: GO_TEMPLATE,
};
