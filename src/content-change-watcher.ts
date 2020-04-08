const watchers = new Map<Node, MutationObserver>();

function watch(node: Node, callback: () => void) {
  if (!node) {
    return;
  }
  (document as any).fonts.ready.then(callback);
  const mo = new MutationObserver(callback);
  mo.observe(node, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
  watchers.set(node, mo);
}

function unwatch(node: Node) {
  const mo = watchers.get(node);
  if (!mo) {
    return;
  }
  mo.disconnect();
  watchers.delete(node);
}

export default {
  watch,
  unwatch,
};
