/**
 * Alternative jquery function .siblings().
 *
 * @param {Element} el - an element to search for siblings elements
 * @returns {Array} - siblings elements
 */
export default function siblings(el) {
  return [...el.parentNode.children].filter((child) => child !== el);
}
