/**
 * Smooth scrolls to the end of element content.
 * @param el {object} jquery dom element
 * @param speed {number} pixels per second, use value 0 to do it immediately
 */
export function smoothScroll (el, speed) {
  // Do nothing is scrolling in progress
  const alreadyScrolling = el.attr('scrolling') === true;
  if (alreadyScrolling) return;

  // Calc delta
  const height = el.innerHeight();
  const delta = el.prop('scrollHeight') - el.prop('scrollTop') - height;

  if (delta > 0) {
    // If delta too big, scrolls immediately
    const immediately = speed === 0 || delta >= height;

    if (immediately) {
      el.prop('scrollTop', el.prop('scrollTop') + delta);
      return;
    }

    // Prevent subsequent calls, while scrolling
    el.attr('scrolling', true);

    el.animate({ scrollTop: '+=' + delta }, delta / speed * 1000, () => {
      // Scroll ends, so clear flag
      el.attr('scrolling', false);

      // Calc actual distance, if it non zero, it means that content of element was changed
      // and we need to continue scrolling
      const delta = el.prop('scrollHeight') - el.prop('scrollTop') - el.innerHeight();

      // Use setTimeout to next call because we inside callback
      if (delta > 0) setTimeout(() => smoothScroll(el, speed), 0);
    });
  }
}
