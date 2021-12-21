/**
 * @fileoverview Organize the import declarations.
 * @author daifeng
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
      description: "organize inline import declaration in alpha-beta order.",
      recommended: false,
    },

    schema: [
      {
        type: "object",
        properties: {
          ignoreCase: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],

    fixable: "code",

    messages: {
      sortMembersAlphabetically:
        "Member '{{memberName}}' of the import declaration should be sorted alphabetically.",
    },
  },

  create(context) {
    const configuration = context.options[0] || {},
      ignoreCase = configuration.ignoreCase || false,
      sourceCode = context.getSourceCode();

    return {
      ImportDeclaration(node) {
        /**
         * @implements
         * Sort the inline-import-order of multiple objects in one declaration.
         */
        const importSpecifiers = node.specifiers.filter(
          (specifier) => specifier.type === "ImportSpecifier"
        );

        const getSortableName = ignoreCase
          ? (specifier) => specifier.local.name.toLowerCase()
          : (specifier) => specifier.local.name;

        /** alpha-beta order by default */
        const firstUnsortedIndex = importSpecifiers
          .map(getSortableName)
          // the import specifier satisfying "array[index - 1] > name", means that it is unordered
          .findIndex((name, index, array) => array[index - 1] > name);

        if (firstUnsortedIndex !== -1) {
          context.report({
            node: importSpecifiers[firstUnsortedIndex],
            messageId: "sortMembersAlphabetically",
            data: {
              memberName: importSpecifiers[firstUnsortedIndex].local.name,
            },
            fix(fixer) {
              /* If there are comments inside the ImportSpecifier list, don't rearrange the specifiers. */
              if (
                importSpecifiers.some(
                  (specifier) =>
                    sourceCode.getCommentsBefore(specifier).length ||
                    sourceCode.getCommentsAfter(specifier).length
                )
              ) {
                return null;
              }

              return fixer.replaceTextRange(
                [
                  importSpecifiers[0].range[0],
                  importSpecifiers[importSpecifiers.length - 1].range[1],
                ],
                importSpecifiers

                  // Clone the importSpecifiers array to avoid mutating it
                  .slice()

                  // Sort the array into the desired order
                  .sort((specifierA, specifierB) => {
                    const aName = getSortableName(specifierA);
                    const bName = getSortableName(specifierB);

                    return aName > bName ? 1 : -1;
                  })

                  /* Build a string out of the sorted list
                     of import specifiers and the text between the originals */
                  .reduce((sourceText, specifier, index) => {
                    const textAfterSpecifier =
                      index === importSpecifiers.length - 1
                        ? ""
                        : sourceCode
                            .getText()
                            .slice(
                              importSpecifiers[index].range[1],
                              importSpecifiers[index + 1].range[0]
                            );

                    return (
                      sourceText +
                      sourceCode.getText(specifier) +
                      textAfterSpecifier
                    );
                  }, "")
              );
            },
          });
        }
        /** end  */
      },
    };
  },
};
