/**
 * @fileoverview Organize the import declarations.
 * @author daifeng
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/inline-import-sort"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

ruleTester.run("inline-import-sort", rule, {
  valid: [
    {
      code: "import { bar, foo } from 'my-module.js';",
    },
  ],

  invalid: [
    {
      code: "import { foo, bar } from 'my-module.js';",
      errors: [{ messageId: "sortMembersAlphabetically" }],
      output: "import { bar, foo } from 'my-module.js';",
    },
  ],
});
