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

    const _pxToRem = (pixels, basePixels = 16) => {
      basePixels = parseFloat(basePixels);
      pixels = parseFloat(pixels);

      return `${pixels / basePixels}rem`;
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
        fn: (elems) => {
          const BEM = _BEM(`accordion`);

          elems.forEach((elem) => {
            const btn = elem.querySelector(`.${BEM.E(`btn`)}`);
            const highlight = elem.querySelector(`.${BEM.E(`highlight`)}`);
            const inner = elem.querySelector(`.${BEM.E(`inner`)}`);
            const mask = elem.querySelector(`.${BEM.E(`mask`)}`);

            let innerHeight = inner.offsetHeight;

            let isAccordionActive = false;
            let isBtnFocused = false;
            let isBtnHovered = false;
            let isInnerAnimating = false;

            const handleBlur = () => {
              isBtnFocused = false;

              anime.remove([mask, highlight]);

              if (!isBtnHovered) {
                const timeline = anime.timeline({
                  duration: 200,
                  easing: `easeOutSine`,
                });

                timeline
                  .add(
                    {
                      fill: `rgba(249, 122, 98, 0.55)`,
                      targets: highlight,
                      scale: `0`,
                    },
                    0
                  )
                  .add(
                    {
                      targets: mask,
                      scale: `0`,
                    },
                    0
                  );
              }
            };

            const handleClick = (e) => {
              const activeClassName = `${_namespace}-active`;

              e.preventDefault();

              if (!isInnerAnimating) {
                const animeProps = {
                  complete: () => {
                    isInnerAnimating = false;
                  },
                  duration: 500,
                  easing: `easeInOutSine`,
                  targets: inner,
                };

                isAccordionActive = !isAccordionActive;
                isInnerAnimating = true;

                elem.classList.toggle(activeClassName);

                if (elem.classList.contains(activeClassName)) {
                  anime({
                    ...animeProps,
                    height: [0, _pxToRem(innerHeight)],
                  });
                } else {
                  anime({
                    ...animeProps,
                    height: [_pxToRem(innerHeight), 0],
                    delay: 100,
                  });
                }
              }
            };

            const handleFocus = () => {
              isBtnFocused = true;

              anime.remove([mask, highlight]);

              if (!isBtnHovered) {
                const timeline = anime.timeline({
                  duration: 500,
                  easing: `easeOutBounce`,
                });

                timeline
                  .add(
                    {
                      fill: `rgb(249, 122, 98)`,
                      scale: [`0`, `1`],
                      targets: highlight,
                    },
                    0
                  )
                  .add(
                    {
                      scale: [`0`, `1`],
                      targets: mask,
                    },
                    0
                  );
              }
            };

            const handleMouseEnter = () => {
              isBtnHovered = true;

              anime.remove(highlight);

              if (isBtnFocused) {
                const timeline = anime.timeline({
                  duration: 200,
                  easing: `easeInOutSine`,
                });

                timeline
                  .add(
                    {
                      fill: `rgba(249, 122, 98, 0.55)`,
                      targets: highlight,
                    },
                    0
                  )
                  .add(
                    {
                      scale: [`1`, `0`],
                      targets: mask,
                    },
                    0
                  );
              } else {
                anime({
                  easing: `easeOutBounce`,
                  duration: 500,
                  scale: [0, 1],
                  targets: highlight,
                });
              }
            };

            const handleMouseLeave = () => {
              isBtnHovered = false;

              anime.remove(highlight);

              if (isBtnFocused) {
                const timeline = anime.timeline({
                  duration: 200,
                  easing: `easeInOutSine`,
                });

                timeline
                  .add(
                    {
                      fill: `rgb(249, 122, 98)`,
                      targets: highlight,
                    },
                    0
                  )
                  .add(
                    {
                      duration: 500,
                      easing: `easeOutBounce`,
                      scale: [`0`, `1`],
                      targets: mask,
                    },
                    0
                  );
              } else {
                anime({
                  easing: `easeOutSine`,
                  duration: 200,
                  scale: 0,
                  targets: highlight,
                });
              }
            };

            const handleResize = () => {
              inner.style.height = ``;
              innerHeight = inner.offsetHeight;

              if (!!isAccordionActive) {
                inner.style.height = _pxToRem(innerHeight);
              } else {
                inner.style.height = 0;
              }
            };

            btn.addEventListener(`blur`, handleBlur, false);
            btn.addEventListener(`click`, handleClick, false);
            btn.addEventListener(`focus`, handleFocus, false);
            btn.addEventListener(`mouseenter`, handleMouseEnter, false);
            btn.addEventListener(`mouseleave`, handleMouseLeave, false);

            inner.style.height = 0;

            window.addEventListener(`resize`, handleResize, false);
          });
        },
        className: `${_namespace}-accordion`,
      },
      imgSlider: {
        fn: (elems) => {
          const BEM = _BEM(`img-slider`);

          elems.forEach((elem) => {
            //
          });
        },
        className: `${_namespace}-img-slider`,
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
        ...document.querySelectorAll(`.${comps[compName].className}`),
      ];

      if (!!elems.length) {
        comps[compName].fn(elems);
      }
    });
  };

  const _addDefaultClassNamesToElements = (selector, ...tagNames) => {
    const entries = document.querySelectorAll(selector);

    if (!!entries.length) {
      entries.forEach((entry) => {
        const elems = entry.querySelectorAll([...tagNames]);

        elems.forEach((elem) => {
          const tagName = elem.tagName.toLowerCase();
          const defaultClassName = `${UpDS.utils.getNamespace()}-${tagName}`;

          if (!elem.classList.contains(defaultClassName)) {
            elem.classList.add(defaultClassName);
          }
        });
      });
    } else {
      console.warn(`PiggyBack.js: Couldn't find a valid DOM entry.`);
    }
  };

  const _addStyleSheets = ([...URLs], fn) => {
    if (!_isPiggyBacked) {
      _isPiggyBacked = true;

      const addedCSS = [];
      const head = document.head;
      const style = document.createElement(`style`);

      style.textContent = ``;

      URLs.forEach((URL) => {
        if (addedCSS.indexOf(URL) === -1) {
          style.textContent += `@import"${URL}";`;
          addedCSS.push(URL);
        }

        // Possible JS latch option

        // const link = document.createElement(`link`);

        // link.rel = `stylesheet`;
        // link.href = URL;

        // link.onload = () => {
        //   console.log(`${URL} has now loaded...`);
        // };

        // head.appendChild(link);
      });

      head.appendChild(style);

      style.addEventListener(`load`, fn, false);
    } else {
      fn();
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
    const styleSheets = [
      // Staging
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      `./css/components.css`,

      // Prod
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      // `https://danmad.github.io/upds/css/components.min.css`,
      // `https://danmad.github.io/upds/css/piggyback.min.css`,
    ];

    _addStyleSheets(styleSheets, () => {
      _addDefaultClassNamesToElements(`#page-content`, ...CMSElements);
      _addComponents(UpDS.components);
    });
  };

  return {
    run,
  };
})();
