(function () {
  const React = {
    useState(initialValue) {
      const hookIndex = (React.__currentHookIndex || 0);
      React.__currentHookIndex = hookIndex + 1;
      const frame = React.__currentFrame;
      if (!frame.hooks) frame.hooks = [];
      if (frame.hooks[hookIndex] === undefined) frame.hooks[hookIndex] = { value: typeof initialValue === 'function' ? initialValue() : initialValue };
      const hook = frame.hooks[hookIndex];
      const setState = (next) => {
        const value = typeof next === 'function' ? next(hook.value) : next;
        if (value !== hook.value) {
          hook.value = value;
          frame.rerender();
        }
      };
      return [hook.value, setState];
    },
    useEffect(effect, deps) {
      const frame = React.__currentFrame;
      if (!frame.effects) frame.effects = [];
      const key = deps ? deps.join('|') : '__none';
      const old = frame.effects[frame.effects.length];
      if (!old || old.key !== key) {
        frame.effects.push({ key, effect, cleanup: null });
      }
    },
    createElement(type, props, ...children) {
      const normalizedProps = { ...(props || {}) };
      normalizedProps.children = children.flat().filter((child) => child !== null && child !== undefined && child !== false);
      return { type, props: normalizedProps };
    }
  };

  const renderNode = (parent, element) => {
    if (typeof element === 'string' || typeof element === 'number') {
      parent.appendChild(document.createTextNode(String(element)));
      return;
    }
    if (Array.isArray(element)) {
      element.forEach((child) => renderNode(parent, child));
      return;
    }
    if (!element || typeof element !== 'object') return;
    const tag = element.type;
    const node = typeof tag === 'function' ? document.createElement('div') : document.createElement(tag);
    if (typeof tag === 'function') {
      const prevFrame = React.__currentFrame;
      const frame = { rerender: () => renderNode(parent, tag()) };
      React.__currentFrame = frame;
      const result = tag();
      React.__currentFrame = prevFrame;
      renderNode(parent, result);
      return;
    }
    const props = element.props || {};
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children' || key === 'key') continue;
      if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'className') {
        node.setAttribute('class', value);
      } else if (value !== false && value !== null && value !== undefined) {
        node.setAttribute(key, value);
      }
    }
    (props.children || []).forEach((child) => renderNode(node, child));
    parent.appendChild(node);
  };

  window.React = React;
  window.ReactDOM = {
    createRoot(container) {
      return {
        render(element) {
          container.innerHTML = '';
          renderNode(container, element);
        }
      };
    }
  };
})();
