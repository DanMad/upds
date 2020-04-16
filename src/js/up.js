'use strict';

// UP Module to reference in application
const UP = (() => {
  // Public
  const accordion = {
    toggle: (node) => {
      if (node.classList.contains(`addClassName`)) {
        node.classList.remove(`addClassName`);

        // add anime call
      } else {
        node.classList.add(`addClassName`);

        // add anime call
      }
    },
  };

  const ping = (str) => {
    console.log(str);
  };

  return {
    accordion,
    ping,
  };
})();

const CMSApp = (() => {
  const _namespace = `up`;

  const _entryPoint = document.querySelector(`#page-content`);
  const _contentNodes = _entryPoint.querySelectorAll(
    `h1, h2, h3, h4, h5, h6, p, li, strong, em, ol, ul, blockquote`
  );

  const _addUPClassNames = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let tag = node.tagName.toLowerCase();

      console.log(`.${_namespace}-${tag}`);
    }
  };

  const run = () => {
    _addUPClassNames(_contentNodes);
  };

  return {
    run,
  };
})();

alert(`firing`);
