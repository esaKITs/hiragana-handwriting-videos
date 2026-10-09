(() => {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  if (!descriptor || !descriptor.set || !descriptor.get) return;

  Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) {
      let next = value;
      if (typeof next === 'string' && next.startsWith('https://www.youtube.com/embed/')) {
        const url = new URL(next);
        url.searchParams.set('mute', '1');
        url.searchParams.set('enablejsapi', '1');
        next = url.toString();
      }
      descriptor.set.call(this, next);
    }
  });

  const muteFrame = frame => {
    if (!(frame instanceof HTMLIFrameElement)) return;
    if (!frame.src.startsWith('https://www.youtube.com/embed/')) return;
    try {
      frame.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'mute',
        args: []
      }), 'https://www.youtube.com');
    } catch {}
  };

  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLIFrameElement) {
          node.addEventListener('load', () => muteFrame(node), { once: true });
          muteFrame(node);
        }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
