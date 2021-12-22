/**
 * @fileoverview Sort tailwind classname in a certain way.
 * @author daifeng
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/tailwind-sort"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});
ruleTester.run("tailwind-sort", rule, {
  valid: [
    {
      code: '<Button class="flex mt-2 mt-4">Sign In</Button>',
    },
  ],

  invalid: [
    {
      code: '<Button class="mt-4 mt-2 flex">Sign In</Button>',
      errors: [
        {
          messageId: "invalidClassNameOrder",
        },
      ],
      output: '<Button class="flex mt-2 mt-4">Sign In</Button>',
    },
    {
      code: '<div class="flex fixed">Sign In</div>',
      errors: [
        {
          messageId: "invalidClassNameOrder",
        },
      ],
      output: '<div class="fixed flex">Sign In</div>',
    },
  ],
});
