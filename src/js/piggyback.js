import { addComponents, getNamespace, listComponents } from './upds';

// if (!Element.hasOwnPoperty(`removeAttributes`)) {
//   Element.prototype.removeAttributes = function (...attrs) {
//     attrs.forEach((attr) => {
//       this.removeAttribute(attr)
//     });
//   }
// }

// if (!Element.hasOwnPoperty(`removeStyle`)) { }

const state = {
  components: listComponents(),
  isPiggyBacked: false,
};

const hasAscendantSelector = (child, ascendantSelector) => {
  let node = child.parentNode;

  while (node !== null) {
    if (!!node.classList && node.classList.contains(ascendantSelector)) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
};

const setDefaults = (selector, ...tagNames) => {
  const entries = document.querySelectorAll(selector);

  if (!!entries.length) {
    entries.forEach((entry) => {
      const elems = entry.querySelectorAll([...tagNames]);

      elems.forEach((elem) => {
        const tagName = elem.tagName.toLowerCase();
        const defaultClassName = `${getNamespace()}-${tagName}`;

        if (tagName === `iframe`) {
          const iframe = document.createElement(`div`);

          elem.classList.add(`${getNamespace()}-iframe__inner`);
          elem.removeAttribute(`height`);
          elem.removeAttribute(`width`);

          iframe.classList.add(`${getNamespace()}-iframe`);

          if (!hasAscendantSelector(elem, `${getNamespace()}-iframe`)) {
            elem.parentNode.insertBefore(iframe, elem);
            iframe.appendChild(elem);
          }
        }

        if (tagName === `p`) {
          if (!hasAscendantSelector(elem, state.components.accordion)) {
            if (elem.children.length === 0) {
              elem.innerText = elem.innerText.trim();

              if (!elem.innerText.length) {
                elem.remove();
              }
            }
          }
        }

        if (tagName === `hr`) {
          elem.remove();
        }

        if (tagName === `a`) {
          const originURL = /((?:https?|ftp):\/\/(www\.)?)?(lucent\.baseux)\.com\/?/;

          if (!originURL.test(elem.href)) {
            elem.rel = `noopener noreferrer`;
            elem.target = `_blank`;
          } else {
            elem.removeAttribute(`rel`);
            elem.removeAttribute(`target`);
          }
        }

        if (tagName !== `iframe`) {
          if (!elem.classList.contains(defaultClassName)) {
            elem.classList.add(defaultClassName);
          }
        }
      });
    });

    addComponents(selector);
  } else {
    console.error(`PiggyBack.js: run() couldn't find a valid DOM entry.`);
  }
};

// const addResource = (callback, URL) => {
//   const elem = document.createElement(`script`);

//   if (!elem.readyState) {
//     elem.onload = callback;
//   } else {
//     // IE fallback
//     if (elem.readyState === `loaded` || elem.readyState === `complete`) {
//       elem.onreadystatechange = null;
//       callback();
//     }
//   }

//   elem.src = url;
//   document.querySelector(`body`).appendChild(elem);
// }

const addScript = (fn, ...paths) => {};

const addedStyleSheets = [];

const addStyleSheets = (fn, ...paths) => {
  const head = document.head;
  const style = document.createElement(`style`);

  style.textContent = `\n`;

  paths.forEach((path) => {
    if (addedStyleSheets.indexOf(path) === -1) {
      addedStyleSheets.push(path);
      style.textContent += `\t@import "${path}";\n`;
    }
  });

  style.addEventListener(`load`, fn, false);
  head.appendChild(style);
};

let isPiggyBacked = false;

const run = (entryPoint) => {
  const CMSElements = [
    `h1`,
    `h2`,
    `h3`,
    `h4`,
    `h5`,
    `h6`,
    `p`,
    `ol`,
    `ul`,
    `li`,
    // `blockquote`,
    `pre`,
    `table`,
    `thead`,
    `tbody`,
    `tr`,
    `th`,
    `td`,
    `hr`,
    `iframe`,
    `strong`,
    `em`,
    `a`,
    `small`,
    `sub`,
    `sup`,
    `code`,
    `kbd`,
    `abbr`,
    `mark`,
  ];

  const styleSheets = [
    // Staging
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    `./css/components.css`,
    // Prod
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // `https://danmad.github.io/upds/css/components.min.css`,
    // `https://danmad.github.io/upds/css/piggyback.min.css`,
  ];

  if (!entryPoint) {
    entryPoint = `#page-content`;
  }

  if (!isPiggyBacked) {
    isPiggyBacked = true;

    addStyleSheets(() => {
      setDefaults(entryPoint, ...CMSElements);
    }, ...styleSheets);
  } else {
    setDefaults(entryPoint, ...CMSElements);
  }
};

export { run };
