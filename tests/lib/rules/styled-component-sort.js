/**
 * @fileoverview Sort the styled-component CSS in alpha-beta order;
 * @author daifeng
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/styled-component-sort"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 8, sourceType: "module" },
});
ruleTester.run("styled-component-sort", rule, {
  valid: [
    {
      code: `const Button = styled.a\`
     /* This renders the buttons above... Edit me! */
     border-radius: 3px;
     color: white;
     display: inline-block;
     padding: 0.5rem 0;\``,
    },
    {
      code: `const Button = styled.a\`
      /* This renders the buttons above... Edit me! */
      border-radius: 3px;
      display: inline-block;
    
      /* The GitHub button is a primary button
       * edit this to target it specifically! */
      \${(props) =>
        props.primary &&
        css\`
          background: white;
          color: black;
        \`}\``,
    },
  ],

  invalid: [
    {
      code: `const Button = styled.a\`
      /* This renders the buttons above... Edit me! */
      color: white;
      border-radius: 3px;
      display: inline-block;
      padding: 0.5rem 0;\``,
      errors: [
        {
          messageId: "invalidPropertyOrder",
        },
      ],
      output: `const Button = styled.a\`
      /* This renders the buttons above... Edit me! */
      border-radius: 3px;
      color: white;
      display: inline-block;
      padding: 0.5rem 0;\``,
    },
    {
      code: `const Button = styled.a\`
      /* This renders the buttons above... Edit me! */
      display: inline-block;
      border-radius: 3px;

      /* The GitHub button is a primary button
       * edit this to target it specifically! */

      \${(props) =>
        props.primary &&
        css\`
          color: black;
          background: white;
        \`}\``,
      errors: [
        {
          messageId: "invalidPropertyOrder",
        },
      ],
      output: `const Button = styled.a\`
      /* This renders the buttons above... Edit me! */
      display: inline-block;
      border-radius: 3px;

      /* The GitHub button is a primary button
       * edit this to target it specifically! */

      \${(props) =>
        props.primary &&
        css\`
          background: white;
          color: black;
        \`}\``,
    },
  ],
});
