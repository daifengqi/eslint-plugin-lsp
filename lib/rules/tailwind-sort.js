/**
 * @fileoverview Sort tailwind classname in a certain order.
 * @author daifeng
 */
"use strict";

const defaultSortOrder = require("../helpers/tailwind-classname-default-order");

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
      description: "Sort tailwind classname in a certain order.",
    },

    fixable: "code",

    schema: [],

    messages: {
      invalidClassNameOrder: "Invalid order of tailwind class names.",
    },
  },

  create(context) {
    /**
     * @param {string} classString
     * @param {string[]} sortOrder
     */
    function sortClassString(classString, sortOrder) {
      let classArray = classString.split(/\s+/g);

      classArray = [
        ...classArray
          .filter((item) => sortOrder.indexOf(item) !== -1)
          .sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b)),
        ...classArray.filter((item) => sortOrder.indexOf(item) === -1),
      ];

      // Remove duplicates
      classArray = [...new Set(classArray)];

      return classArray.join(" ").trim();
    }
    /**
     * @param {ASTNode} node
     */
    function getAttributeValue(node) {
      if (node.attributeValue) {
        return node.attributeValue;
      }

      return Array.isArray(node.value) ? node.value[0] : node.value;
    }

    /**
     * @param {ASTNode} node
     */
    function isValidJSXNode(node) {
      if (!node.name || ["class", "className"].indexOf(node.name.name) === -1) {
        return false;
      }
      if (!getAttributeValue(node)) {
        return false;
      }
      if (["Literal", "Text"].indexOf(getAttributeValue(node).type) === -1) {
        return false;
      }
      return true;
    }

    function parseValue(value) {
      return String(value).trim().replace(/  +/g, " ");
    }

    return {
      JSXAttribute(node) {
        if (!isValidJSXNode(node)) {
          return null;
        }

        const valueNode = getAttributeValue(node);
        const value = parseValue(valueNode.value);
        const sortedClasses = sortClassString(value, defaultSortOrder);
        if (sortedClasses === value) {
          return null;
        }

        context.report({
          node,
          loc: getAttributeValue(node).loc,
          messageId: "invalidClassNameOrder",
          fix: (fixer) =>
            fixer.replaceTextRange(
              [
                getAttributeValue(node).range[0] + 1,
                getAttributeValue(node).range[1] - 1,
              ],
              sortedClasses
            ),
        });
      },
    };
  },
};
