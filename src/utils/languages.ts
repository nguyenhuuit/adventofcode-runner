export const EXTENSIONS: { [key: string]: string } = {
  javascript: 'mjs',
  python: 'py',
  java: 'java',
  go: 'go',
  ruby: 'rb',
  cpp: 'cpp',
};

const CPP_TEMPLATE = `#include <iostream>

using namespace std;

string solution(const string& input_content) {
    return "0";
}
`;

const PYTHON_TEMPLATE = `def solution(input):
  pass
`;

const RUBY_TEMPLATE = `def solution(input)
  return nil
end
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
  cpp: CPP_TEMPLATE,
  ruby: RUBY_TEMPLATE,
};
