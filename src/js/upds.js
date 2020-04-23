'use strict';

// import './polyfills/element.classList';

const PiggyBack = (() => {
  const UpDS = (() => {
    const _namespace = `up`;

    const _BEM = (block) => {
      const B = () => {
        return `${_namespace}-${block}`;
      };

      const E = (...elems) => {
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

      const M = (...modifiers) => {
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

      return { B, E, M };
    };

    const _pxToRem = (pixels, basePixels = 16) => {};

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
          const BEM = _BEM(`accordion`);

          const btn = elem.getElementsByClassName(BEM.E(`btn`))[0];
          const inner = elem.getElementsByClassName(BEM.E(`inner`))[0];
          const highlight = elem.getElementsByClassName(BEM.E(`highlight`))[0];
          const mask = elem.getElementsByClassName(BEM.E(`mask`))[0];

          let height = inner.offsetHeight;

          let isActive = false;
          let isFocused = false;
          let isHovered = false;
          let isTransitioning = false;

          const handleClick = (e) => {
            const activeClassName = `${_namespace}-active`;
            const animeProps = {
              complete: () => {
                isTransitioning = false;
              },
              duration: 500,
              easing: `easeInOutSine`,
              targets: inner,
            };

            e.preventDefault();

            if (!isTransitioning) {
              isTransitioning = true;
              isActive = !isActive;
              elem.classList.toggle(activeClassName);

              if (elem.classList.contains(activeClassName)) {
                anime({
                  ...animeProps,
                  height: [0, height],
                });
              } else {
                anime({
                  ...animeProps,
                  height: [height, 0],
                  delay: 100,
                });
              }
            }
          };

          const highlightContract = () => {
            anime({
              easing: `easeOutSine`,
              duration: 200,
              scale: [1, 0],
              targets: highlight,
            });
          };

          const highlightExpand = () => {
            anime({
              easing: `easeOutBounce`,
              duration: 500,
              scale: [0, 1],
              targets: highlight,
            });
          };

          const maskContract = () => {
            anime({
              easing: `easeOutSine`,
              duration: 200,
              scale: [1, 0],
              targets: mask,
            });
          };

          const maskExpand = () => {
            anime({
              easing: `easeOutBounce`,
              duration: 500,
              scale: [0, 1],
              targets: mask,
            });
          };

          const handleBlur = () => {
            if (!isHovered) {
              highlightContract();
            }

            isFocused = false;
          };

          const handleFocus = () => {
            if (!isHovered) {
              highlightExpand();
            }

            isFocused = true;
          };

          const handleMouseDown = () => {
            maskExpand();
          };

          const handleMouseEnter = () => {
            if (!isFocused) {
              highlightExpand();
            }

            isHovered = true;
          };

          const handleMouseLeave = () => {
            if (!isFocused) {
              highlightContract();
            }

            isHovered = false;
          };

          const handleMouseUp = () => {
            maskContract();
          };

          const handleResize = () => {
            inner.setAttribute(`style`, ``);
            height = inner.offsetHeight;

            if (!!isActive) {
              inner.setAttribute(`style`, `height:${height};`);
            } else {
              inner.setAttribute(`style`, `height:0;`);
            }
          };

          inner.setAttribute(`style`, `height:0;`);

          btn.addEventListener(`click`, handleClick, false);
          btn.addEventListener(`blur`, handleBlur, false);
          btn.addEventListener(`focus`, handleFocus, false);
          // btn.addEventListener(`mousedown`, handleMouseDown, false);
          btn.addEventListener(`mouseenter`, handleMouseEnter, false);
          btn.addEventListener(`mouseleave`, handleMouseLeave, false);
          // btn.addEventListener(`mouseup`, handleMouseUp, false);

          window.addEventListener(`resize`, handleResize, false);
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
        const defaultClassName = `${UpDS.utils.getNamespace()}-${tagName}`;

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
