# Advent of Code Runner

[![npm](https://img.shields.io/npm/v/@nguyenhuu/adventofcode?color=lightgreen&label=npm&logo=npm&style=flat)](https://www.npmjs.com/package/@nguyenhuu/adventofcode)
[![Node.js CI](https://github.com/nguyenhuuit/adventofcode-runner/actions/workflows/publish-canary.yml/badge.svg)](https://github.com/nguyenhuuit/adventofcode-runner/actions/workflows/publish-canary.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/nguyenhuuit/adventofcode-runner)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome!-6f42c1?style=flat&logo=github&logoColor=white)](https://github.com/nguyenhuuit/adventofcode-runner/pulls)

A CLI tool to help you run and test your Advent of Code solutions across different programming languages.

## Features

- 🚀 Run solutions in multiple languages (Python, JavaScript, Java, C++, Ruby)
- 🔄 Watch mode for automatic re-runs
- 🎨 Beautiful terminal UI with spinners and colors
- 🧪 Test your solutions with sample inputs
- 📊 Track your progress and performance

## Installation

You can use the tool in two ways:

### Option 1: Using npx (Recommended)
```bash
# Run directly without installation
npx @nguyenhuu/adventofcode

# Or with specific command
npx @nguyenhuu/adventofcode --year 2024 --day 1 --part 1 --language python
```

### Option 2: Global Installation
```bash
# Install globally
npm install -g @nguyenhuu/adventofcode

# Run the tool
adventofcode
```

## Setup

Save your `session` cookie into `.env` file in the root folder:
```
SESSION=f8fe3ed61...
```

> The `session` cookie can be found in Developer Tools > Application tab > Cookies > `https://adventofcode.com` (requires login)

## Usage

### Basic Examples

```bash
# Using npx
npx @nguyenhuu/adventofcode --year 2024 --day 1 --part 1 --language python

# Or with global installation
adventofcode --year 2024 --day 1 --part 1 --language python
```

### Interactive Mode

```bash
# Using npx
npx @nguyenhuu/adventofcode

# Or with global installation
adventofcode

# The tool will prompt for missing information:
? Select programming language: (Use arrow keys)
❯ Python 
  Javascript 
  Java 
  C++ 
  Ruby
? Select year: 2024
? Select day: 1
? Select part: (Use arrow keys)
❯ Part 1 
  Part 2 
```

### Using Sample Input

1. Create a `sample.txt` file in your solution directory:
```
current/
└── 2023/
    └── day1/
        ├── sample.txt    # Your test input
        └── part1.py      # Your solution
```

2. Press `s` during runtime to use sample input

### Submitting Solutions

1. Run your solution
2. Press `u` to submit the result
3. The tool will:
   - Submit your answer
   - Show if it's correct
   - Display your progress

### Options

- `--year`: The year of the challenge (e.g., 2023)
- `--day`: The day of the challenge (1-25)
- `--part`: The part of the challenge (1 or 2)
- `--language`: Programming language (python, javascript, java, cpp, ruby)
- `--help`: Show help information

### Hotkeys

- **s**: Use sample.txt as input
- **i**: Use input.txt as input
- **u**: Submit the most recent result
- **0-9**: Select part
- **c**: Clear terminal
- **q**: Quit program
- **x**: Terminate solution
- **Enter**: Re-run solution
- **h**: Show help

### Folder Structure

```
current/
├── 2023/
│   └── day1/
│       ├── sample.txt
│       └── part1.py
└── .env
```

![demo](https://cdn.huu.app/images/adventofcode-runner.png)

## Development

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Setup

This project uses pnpm for package management. If you haven't installed pnpm yet, you can do so globally with:

```bash
npm install -g pnpm
```

Then, install the project dependencies:

```bash
pnpm install
```

```bash
# Clone the repository
git clone https://github.com/nguyenhuuit/adventofcode-runner.git
cd adventofcode-runner

# Install dependencies
pnpm install

# Build the project
pnpm run build
```

### Available Scripts

- `pnpm start`: Builds the project and runs the main script.
- `pnpm start:dev`: Runs the project in development mode.
- `pnpm lint`: Lints the source files.
- `pnpm lint:fix`: Lints and fixes issues in the source files.
- `pnpm format`: Formats the source files using Prettier.
- `pnpm format:check`: Checks if the source files are formatted correctly.
- `pnpm test`: Runs the tests using Jest.

### Project Structure

```
src/
├── components/     # React components for UI
├── drivers/        # Language-specific drivers
├── hooks/          # React hooks
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Huu Nguyen <nguyenhuuit@yahoo.com>
