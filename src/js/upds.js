'use strict';

// import './polyfills/element.classList';

const PiggyBack = (() => {
  const UpDS = (() => {
    const _namespace = `up`;

    const _BEM = (block) => {
      const getBlockName = () => {
        return `${_namespace}-${block}`;
      };

      const getElementName = (...elems) => {
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

      const getModifierName = (...modifiers) => {
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
        getBlockName,
        getElementName,
        getModifierName,
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
        fn: (elem) => {
          let isActive = false;
          let isTransitioning = false;

          const BEM = _BEM(`accordion`);

          const btn = elem.getElementsByClassName(BEM.getElementName(`btn`))[0];
          const highlight = elem.getElementsByClassName(
            BEM.getElementName(`highlight`)
          )[0];
          const inner = elem.getElementsByClassName(
            BEM.getElementName(`inner`)
          )[0];
          const mask = elem.getElementsByClassName(
            BEM.getElementName(`mask`)
          )[0];

          let btnHeight = btn.clientHeight;
          let innerHeight = inner.offsetHeight;

          // console.log(`btnHeight: ` + btnHeight);
          console.log(`innerHeight: ` + innerHeight);

          inner.style.height = 0;

          const handleClick = (e) => {
            e.preventDefault();

            elem.classList.toggle(`${_namespace}-active`);

            if (elem.classList.contains(`${_namespace}-active`)) {
              anime({
                duration: 800,
                targets: inner,
                height: [0, innerHeight],
                easing: `easeOutBounce`,
              });
            } else {
              anime({
                delay: 200,
                duration: 300,
                targets: inner,
                height: [innerHeight, 0],
                easing: `easeInOutSine`,
              });
            }
          };

          btn.onclick = handleClick;

          //       function handleMouseEnter() {
          //         const highlight = node.querySelector(
          //           // `.${bem.getElementName(`highlight`)}`
          //           `.${_namespace}-highlight__tint`
          //         );
          //         anime({
          //           easing: `easeOutElastic(1, .6)`,
          //           scale: [0, 1],
          //           targets: highlight,
          //         });
          //       }
          //       function handleMouseLeave() {
          //         const highlight = node.querySelector(
          //           // `.${bem.getElementName(`highlight`)}`
          //           `.${_namespace}-highlight__tint`
          //         );
          //         anime({
          //           easing: `easeOutElastic(1, .6)`,
          //           scale: 0,
          //           targets: highlight,
          //         });
          //       }
          //       function handleResize() {
          //         console.log(`Firing!`);
          //       }
          //       btn.onmouseenter = handleMouseEnter;
          //       btn.onmouseleave = handleMouseLeave;
          //       window.onresize = handleResize;
        },
        className: `${_namespace}-accordion`,
      },
    };

    return {
      components,
      utils,
    };
  })();

  let _isPiggyBacked = false;
  const _namespace = UpDS.utils.getNamespace();

  const _addComponents = (comps) => {
    const compNames = Object.keys(comps);

    compNames.forEach((compName) => {
      const elems = [
        ...document.getElementsByClassName(comps[compName].className),
      ];

      if (!!elems.length) {
        elems.forEach((elem) => {
          comps[compName].fn(elem);
        });
      }
    });
  };

  const _addCSS = ([...URLs], fn) => {
    if (!_isPiggyBacked) {
      _isPiggyBacked = true;

      const head = document.head;
      const style = document.createElement(`style`);

      style.textContent = ``;

      const addedCSS = [];

      URLs.forEach((URL) => {
        if (addedCSS.indexOf(URL) === -1) {
          style.textContent += `@import"${URL}";`;
          addedCSS.push(URL);
        }
      });

      head.appendChild(style);

      const isCSSLoaded = () => {
        if (!!style.sheet.cssRules) {
          fn();
          clearInterval(i);
        }
      };

      const i = setInterval(isCSSLoaded, 10);
    } else {
      fn();
    }
  };

  const _addDefaultClassNamesToElements = (entry, ...tagNames) => {
    const id = document.getElementById(entry);

    if (!!id) {
      const elems = id.querySelectorAll([...tagNames]);

      elems.forEach((elem) => {
        const tagName = elem.tagName.toLowerCase();
        const defaultClassName = `${_namespace}-${tagName}`;

        if (!elem.classList.contains(defaultClassName)) {
          elem.classList.add(defaultClassName);
        }
      });
    } else {
      console.warn(`PiggyBack.js: Couldn't find a valid DOM entry.`);
    }
  };

  // Public
  // ---------------------------------------------------------------------------
  const run = () => {
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
    const stagingCSS = [`./css/components.css`];
    // const prodCSS = [
    //   `https://danmad.github.io/upds/css/components.css`,
    //   `https://danmad.github.io/upds/css/piggyback.css`,
    // ];

    _addCSS(stagingCSS, () => {
      _addDefaultClassNamesToElements(`page-content`, ...CMSElements);
      _addComponents(UpDS.components);
    });
  };

  return {
    run,
  };
})();
