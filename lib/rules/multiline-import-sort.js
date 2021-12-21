/* eslint-disable no-unused-vars */
/**
 * @fileoverview Sort multiline import declarations.
 * @author multiline-import-sort
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Sort multiline import declarations.",
    },

    schema: [
      {
        type: "object",
        properties: {
          head: {
            type: "array",
            items: {
              type: "string",
            },
          },
          tail: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    ],

    fixable: "code",

    messages: {
      sortImportNotCorrect:
        "Import declarations of the module sort incorrectly",
    },
  },

  create(context) {
    const configuration = context.options[0] || {},
      head = configuration.head || [],
      tail = configuration.tail || [],
      sourceCode = context.getSourceCode();

    /**
     * Divide declarations into head, default and tail group.
     * @param {ImportDeclaration} dclrs
     * @returns {Array<ImportDeclaration>} [headDclr, defaultDclr, tailDclr]
     */
    function divideDeclarations(dclrs) {
      const headRegs = head.map((s) => new RegExp(s)),
        tailRegs = tail.map((s) => new RegExp(s));
      // 2. withdraw declarations for each group
      let headDclr = new Array(headRegs.length),
        tailDclr = new Array(tailRegs.length),
        defaultDclr = [];

      for (const _dclr of dclrs) {
        let taken = false;
        const dclr = { ..._dclr };

        for (const i in headRegs) {
          const reg = headRegs[i];
          if (reg.test(dclr.source.value)) {
            if (headDclr[i] && headDclr[i].length) {
              headDclr[i].push(dclr);
            } else {
              headDclr[i] = [dclr];
            }
            taken = true;
          }
        }

        if (!taken) {
          for (const i in tailRegs) {
            const reg = tailRegs[i];
            if (reg.test(dclr.source.value)) {
              if (tailDclr[i] && tailDclr[i].length) {
                tailDclr[i].push(dclr);
              } else {
                tailDclr[i] = [dclr];
              }
              taken = true;
            }
          }
        }

        if (!taken) {
          defaultDclr.push(dclr);
        }
      }

      headDclr = headDclr.filter((v) => Boolean(v)).flat(1);
      tailDclr = tailDclr.filter((v) => Boolean(v)).flat(1);

      // 3. return
      return [headDclr, defaultDclr, tailDclr];
    }

    const syntaxTypes = ["none", "all", "default", "multiple"];
    /**
     * @param {ASTNode} node
     * @returns {string}
     */
    function useDclrSyntax(node) {
      if (node.specifiers.length === 0) {
        return syntaxTypes[0];
      }
      if (node.specifiers[0].type === "ImportNamespaceSpecifier") {
        return syntaxTypes[1];
      }
      if (node.specifiers[0].type === "ImportDefaultSpecifier") {
        return syntaxTypes[2];
      }
      return syntaxTypes[3];
    }
    /**
     * @param {ImportDeclaration[]} _dclrs
     * @returns {ImportDeclaration[]}
     */
    function sortDefaultDclrs(_dclrs) {
      const dclrs = [..._dclrs];
      dclrs.sort((d1, d2) => {
        const s1 = useDclrSyntax(d1);
        const s2 = useDclrSyntax(d2);
        /** same type -> alpha-beta order */
        if (s1 === s2) {
          /** alpha-beta order */
          return d1.source.value.localeCompare(d2.source.value);
        } else {
          return syntaxTypes.indexOf(s1) - syntaxTypes.indexOf(s2);
        }
      });

      return dclrs;
    }

    return {
      Program(node) {
        // get
        const importDeclarations = node.body.filter(
          (d) => d.type === "ImportDeclaration"
        );
        if (!importDeclarations) {
          return null;
        }

        // divide
        const [headDclr, defaultDclr, tailDclr] =
          divideDeclarations(importDeclarations);

        // raw v.s. target (only need to sort defaultDclr), since other two are pushed into arrays by the order
        let raw = "";
        for (const node of importDeclarations) {
          raw += sourceCode.getText(node) + "\n";
        }

        let target = "";
        const _defaultDclr = sortDefaultDclrs(defaultDclr);
        for (const node of [...headDclr, ..._defaultDclr, ...tailDclr]) {
          target += sourceCode.getText(node) + "\n";
        }

        if (raw === target) {
          return null;
        }

        context.report({
          node: importDeclarations[0],
          messageId: "sortImportNotCorrect",
          fix(fixer) {
            const rangeStart = importDeclarations[0].range[0];
            const rangeEnd =
              importDeclarations[importDeclarations.length - 1].range[1];

            return fixer.replaceTextRange([rangeStart, rangeEnd], target);
          },
        });
      },
    };
  },
};
