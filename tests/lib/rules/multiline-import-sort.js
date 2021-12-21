/**
 * @fileoverview Sort multiline import declarations.
 * @author multiline-import-sort
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/multiline-import-sort"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("multiline-import-sort", rule, {
  valid: [
    {
      code: "import React from 'react';",
    },
    {
      code: "import React from 'react';\n" + "import a from 'a';",
      options: [
        {
          head: ["^react"],
        },
      ],
    },
  ],

  invalid: [
    {
      code: "import React from 'react';\n" + "import a from 'a';",
      errors: [{ messageId: "sortImportNotCorrect" }],
      output: "import a from 'a';\n" + "import React from 'react';\n",
    },
    {
      code: "import a from 'a';\n" + "import React from 'react';",
      options: [
        {
          head: ["^react"],
        },
      ],
      errors: [{ messageId: "sortImportNotCorrect" }],
      output: "import React from 'react';\n" + "import a from 'a';\n",
    },
    {
      code:
        "import a from 'a';\n" +
        "import { useTranslation } from 'jupiter-runtime/i18n';\n" +
        "import React from 'react';",
      options: [
        {
          head: ["^react"],
          tail: ["^jupiter"],
        },
      ],
      errors: [{ messageId: "sortImportNotCorrect" }],
      output:
        "import React from 'react';\n" +
        "import a from 'a';\n" +
        "import { useTranslation } from 'jupiter-runtime/i18n';\n",
    },
    {
      code:
        "import { hh } from '@byte/seller';\n" +
        "import a from 'a';\n" +
        "import { useTranslation } from 'jupiter-runtime/i18n';\n" +
        "import React from 'react';",
      options: [
        {
          head: ["^react"],
          tail: ["^jupiter"],
        },
      ],
      errors: [{ messageId: "sortImportNotCorrect" }],
      output:
        "import React from 'react';\n" +
        "import a from 'a';\n" +
        "import { hh } from '@byte/seller';\n" +
        "import { useTranslation } from 'jupiter-runtime/i18n';\n",
    },
    {
      code:
        "import { foo } from 'b';\n" +
        "import { bar } from 'a';\n" +
        "import React from 'react';",
      options: [
        {
          head: ["^react"],
        },
      ],
      errors: [{ messageId: "sortImportNotCorrect" }],
      output:
        "import React from 'react';\n" +
        "import { bar } from 'a';\n" +
        "import { foo } from 'b';\n",
    },
  ],
});
