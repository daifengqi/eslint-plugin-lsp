/**
 * @fileoverview Sort the styled-component CSS in alpha-beta order.
 * @author daifeng
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isStyledTagname(node) {
  return (
    (node.tag.type === "Identifier" && node.tag.name === "css") ||
    (node.tag.type === "MemberExpression" &&
      node.tag.object.name === "styled") ||
    (node.tag.type === "CallExpression" &&
      (node.tag.callee.name === "styled" ||
        (node.tag.callee.object &&
          ((node.tag.callee.object.callee &&
            node.tag.callee.object.callee.name === "styled") ||
            (node.tag.callee.object.object &&
              node.tag.callee.object.object.name === "styled")))))
  );
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Sort the styled-component CSS in alpha-beta order.",
    },

    fixable: "code",

    schema: [],

    messages: {
      invalidPropertyOrder: "Invalid order of styled-component CSS properties.",
    },
  },

  create(context) {
    /**
     *
     * @param {string} raw
     * @returns {{str: string; idx: number; len: number}} record some data of raw template to build target
     */
    function rawToRecord(raw) {
      return [
        ...raw.matchAll(/(([a-zA-Z0-9]|-)+):(\s+)(([a-zA-Z0-9]|-|\s|\.)+)/g),
      ].map((v) => {
        return { str: v[0], idx: v.index, len: v[0].length };
      });
    }

    function buildTarget(raw, rawRecord, targetRecord) {
      /** build sorted styled-component CSS from empty */
      let target = "";
      let left = 0;
      for (const i in rawRecord) {
        target =
          target + raw.substring(left, rawRecord[i].idx) + targetRecord[i].str;
        left = rawRecord[i].idx + rawRecord[i].len;
      }
      if (left) {
        target += raw.substring(left);
      }
      return target;
    }

    return {
      TaggedTemplateExpression(node) {
        if (!isStyledTagname(node)) {
          return null;
        }

        /** note: cannot fix styled-components with expressions! */
        if (node.quasi.expressions.length) {
          return null;
        }

        // get
        const raw = node.quasi.quasis[0].value.raw;

        // transform
        const rawRecord = rawToRecord(raw);
        const targetRecord = [...rawRecord].sort((a, b) =>
          a.str.localeCompare(b.str)
        );

        // build
        const target = buildTarget(raw, rawRecord, targetRecord);

        /** if same */
        if (target === raw) {
          return null;
        }

        context.report({
          node,
          messageId: "invalidPropertyOrder",
          fix(fixer) {
            return fixer.replaceTextRange(
              [
                node.quasi.quasis[0].range[0] + 1,
                node.quasi.quasis[0].range[1] - 1,
              ],
              target
            );
          },
        });
      },
    };
  },
};
