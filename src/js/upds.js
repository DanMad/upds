'use strict';

const PiggyBack = (() => {
  const UpDS = (() => {
    const _namespace = `up`;

    const _BEM = (block) => {
      const getBlock = () => {
        return `${_namespace}-${block}`;
      };

      const getElem = (...elems) => {
        const addedElems = [];
        let str = ``;

        elems.forEach((elem) => {
          if (addedElems.indexOf(elem) === -1) {
            str += `${_namespace}-${block}__${elem} `;

            addedElems.push(elem);
          }
        });

        return str.trim();
      };

      const getModifier = (...modifiers) => {
        const addedModifiers = [];
        let str = ``;

        modifiers.forEach((modifier) => {
          if (addedModifiers.indexOf(modifier) === -1) {
            str += `${_namespace}-${block}--${modifier} `;

            addedModifiers.push(modifier);
          }
        });

        return str.trim();
      };

      return {
        getBlock,
        getElem,
        getModifier,
      };
    };

    // Public
    // ---------------------------------------------------------------------------
    const utils = {
      getNamespace: () => {
        return _namespace;
      },
    };

    const components = {
      accordion: {
        fn: (node) => {
          const bem = _BEM(`accordion`);
          const btn = node.querySelector(`.${bem.getElem(`btn`)}`);
          const outer = node.querySelector(`.${bem.getElem(`outer`)}`);

          function handleClick(e) {
            e.preventDefault();

            if (node.classList.contains(`${_namespace}-active`)) {
              node.classList.remove(`${_namespace}-active`);
              anime({
                targets: outer,
                height: [outer.offsetHeight, 0],
                easing: `linear`,
              });
            } else {
              node.classList.add(`${_namespace}-active`);
              anime({
                targets: outer,
                height: [0, outer.offsetHeight],
                easing: `linear`,
              });
            }
          }

          function resetHeight() {
            console.log(`Firing!`);
          }

          btn.onclick = handleClick;
          window.onresize = resetHeight;
        },
        selector: `.${_namespace}-accordion`,
      },
    };

    return {
      components,
      utils,
    };
  })();

  const _addedCSS = [];
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
  const _namespace = UpDS.utils.getNamespace();
  let _piggyBacked = false;

  const _addCSS = (...URLs) => {
    URLs.forEach((URL) => {
      if (_addedCSS.indexOf(URL) === -1) {
        const head = document.head;
        const link = document.createElement(`link`);

        link.href = URL;
        link.rel = `stylesheet`;

        head.appendChild(link);

        _addedCSS.push(URL);
      } else {
        console.warn(
          `PiggyBack.js: _addCSS() encountered duplicate arguments.`
        );
      }
    });
  };

  const _addDefaultClassNamesToElems = (entryPoint) => {
    const nodes = entryPoint.querySelectorAll(_contentElems);

    nodes.forEach((node) => {
      const tag = node.tagName.toLowerCase();

      if (!node.classList.contains(`${_namespace}-${tag}`)) {
        node.classList.add(`${_namespace}-${tag}`);
      }
    });
  };

  // Public
  // ---------------------------------------------------------------------------
  const run = () => {
    const components = Object.keys(UpDS.components);
    const entryPoints = document.querySelectorAll(`#page-content`);

    if (!_piggyBacked) {
      _addCSS(
        // Staging
        `./css/components.css`,
        `./css/layouts.css`

        // Prod
        //   `https://danmad.github.io/upds/css/components.css`,
        //   `https://danmad.github.io/upds/css/layouts.css`,
        //   `https://danmad.github.io/upds/css/piggyback.css`
      );

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
      const nodes = document.querySelectorAll(
        UpDS.components[component].selector
      );

      if (!!nodes.length) {
        nodes.forEach((node) => {
          UpDS.components[component].fn(node);
        });
      }
    });
  };

  return {
    run,
  };
})();
