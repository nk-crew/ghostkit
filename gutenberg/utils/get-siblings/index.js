/**
 * Get sibling elements.
 *
 * @param {Element} el - an element to search for sibling elements
 * @returns {Array} - sibling elements
 */
export default function getSiblings(el) {
  return [...el.parentNode.children].filter((child) => child !== el);
}
