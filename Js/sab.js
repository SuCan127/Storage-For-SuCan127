(function removeSmartAppBanner() {
  const selector = 'meta[name="apple-itunes-app"]';

  // Remove any existing meta tags immediately
  function removeExisting() {
    try {
      const metas = document.querySelectorAll(selector);
      metas.forEach(m => m.remove());
    } catch (e) {
      // defensive: ignore DOM access errors
    }
  }

  removeExisting();

  // Watch the <head> in case a script injects the meta later
  const head = document.head || document.getElementsByTagName('head')[0];
  if (!head) return;

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          try {
            // If the node itself is the meta, remove it
            if (node.matches && node.matches(selector)) {
              node.remove();
            } else if (node.querySelector) {
              // If the node contains the meta deeper, remove those too
              const found = node.querySelectorAll(selector);
              found.forEach(n => n.remove());
            }
          } catch (e) { /* ignore */ }
        });
      } else if (m.type === 'attributes' && m.target) {
        // If attributes change on an element that matches, remove it
        try {
          if (m.target.matches && m.target.matches(selector)) m.target.remove();
        } catch (e) { /* ignore */ }
      }
    }
  });

  observer.observe(head, { childList: true, subtree: true, attributes: true, attributeFilter: ['name'] });

  // Optional: provide a way to stop observing if needed
  if (!window.__stopRemoveSmartAppBanner) {
    window.__stopRemoveSmartAppBanner = () => observer.disconnect();
  }
})();
