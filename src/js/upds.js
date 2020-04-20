'use strict';

const Up = (() => {
  // Private
  // ---------------------------------------------------------------------------
  const _namespace = `up`;

  // Public
  // ---------------------------------------------------------------------------
  const getNamespace = () => {
    return _namespace;
  };

  // Components
  const accordion = () => {
    console.log(
      `PiggyBack.js: Successfully called Up.js API and referenced the accordion component.`
    );
  };

  return {
    accordion,
    getNamespace,
  };
})();

const PiggyBack = (() => {
  // Private
  // ---------------------------------------------------------------------------
  const _addedCSS = [];
  const _namespace = Up.getNamespace();
  let _piggyBacked = false;
  const _contentElems = [
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
    `blockquote`,
    `pre`,
    `table`,
    `thead`,
    `tbody`,
    `tr`,
    `th`,
    `td`,
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

  const _addCSS = (...URLs) => {
    URLs.forEach((URL) => {
      if (_addedCSS.indexOf(URL) === -1) {
        const link = document.createElement(`link`);

        link.href = URL;
        link.rel = `stylesheet`;

        document.head.appendChild(link);

        _addedCSS.push(URL);
      } else {
        console.warn(
          `PiggyBack.js: _addCSS() encountered duplicate arguments.`
        );
      }
    });
  };

  const _addDefaultClassNamesToElems = (entryPoint) => {
    const elems = entryPoint.querySelectorAll(_contentElems);

    elems.forEach((elem) => {
      const tag = elem.tagName.toLowerCase();

      if (!elem.classList.contains(`${_namespace}-${tag}`)) {
        elem.classList.add(`${_namespace}-${tag}`);
      }
    });
  };

  // Public
  // ---------------------------------------------------------------------------
  const run = (...components) => {
    const entryPoints = document.querySelectorAll(`#page-content`);

    if (!_piggyBacked) {
      _addCSS(`./css/upds.min.css`); // Contextualise address at build time: ./ --> https://danmad.github.io/upds/

      _piggyBacked = true;
    }

    if (!!entryPoints.length) {
      entryPoints.forEach((entryPoint) => {
        _addDefaultClassNamesToElems(entryPoint);
      });
    } else {
      console.warn(
        `PiggyBack.js: run() couldn't find a valid entry point in the DOM.`
      );
    }

    components.forEach((component) => {
      if (typeof component === `string`) {
        component = component.toLowerCase();

        if (!!Up[component]) {
          Up[component]();
        } else {
          console.warn(`Up.js: '${component}' components are not supported.`);
        }
      } else {
        console.warn(`PiggyBack.js: run() only accepts 'string' arguments.`);
      }
    });
  };

  return {
    run,
  };
})();
