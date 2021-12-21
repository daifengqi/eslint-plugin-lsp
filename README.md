# eslint-plugin-lsp

Eslint plugin for sorting import declarations and some JSX.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-lsp`:

```sh
npm install eslint-plugin-lsp --save-dev
```

## Usage

Add `1` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["lsp"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "lsp/rule-name": 2
  }
}
```

## Supported Rules

- Fill in provided rules here

## Contribution Guide

To generate a new rule, run `yo eslint:rule`.
