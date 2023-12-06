# [Advent of Code](https://adventofcode.com/)
## Get started
Save your `session` cookie into `.env` file in the root folder as below:
```
SESSION=f8fe3ed61...
```
> The `session` cookie can be found in Developer Tools > Application tab > Cookies > `https://adventofcode.com`, of course, we need to log in to have it.

Start solving problems
```

npx @nguyenhuu/adventofcode@latest -d <day> -p <part> -y <year> -l <language>
```
Example:
```
npx @nguyenhuu/adventofcode@latest -d 1 -p 1 -y 2023 -l python
```
The folder structure would be:
```
current
  ├── 2023
  │  └── day1
  │     ├── sample.txt
  │     └── part1.py
  └── .env
  
```

## Hot keys
* **s** : Using sample.txt as input
* **i** : Using input.txt as input
* **u** : Submit the most recent result
* **0** ->  **9** : Select part
* **c** : Clear terminal
* **q** : Quit program
* **x** : Terminate solution
* **Enter** : Re-run solution
* **h** : Show helps

![demo](https://cdn.huu.app/images/adventofcode-runner.png)

## Supported languages
> Need an installed runtime!
* Javascript `.mjs`
* Python `.py`
* Golang `.go` 
* Java `.java`
