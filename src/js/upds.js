'use strict';

const PiggyBack = (() => {
  const UpDS = (() => {
    const _namespace = `up`;
    let _uniqueIdCount = 0;
    const _version = `v0.2.0`;

    const _pxToRem = (pixels, basePixels = 16) => {
      pixels = parseFloat(pixels);
      basePixels = parseFloat(basePixels);

      return `${pixels / basePixels}rem`;
    };

    const _uniqueId = () => {
      return `${_namespace}-id-${_uniqueIdCount++}`;
    };

    // Public
    // ---------------------------------------------------------------------------
    const utils = {
      getNamespace: () => {
        return _namespace;
      },
      getVersion: () => {
        return _version;
      },
    };

    const components = {
      accordion: {
        className: `${_namespace}-accordion`,
        fn: (elems) => {
          elems.forEach((elem) => {
            const btn = elem.querySelector(`.${_namespace}-accordion__btn`);
            const inner = elem.querySelector(`.${_namespace}-accordion__inner`);
            const mask = elem.querySelector(`.${_namespace}-icon__mask`);
            const maskHidden = elem.querySelector(
              `.${_namespace}-icon__mask--hidden`
            );
            const tint = elem.querySelector(`.${_namespace}-icon__tint`);

            let isAccordionActive = false;
            let isBtnFocused = false;
            let isBtnHovered = false;
            let isInnerAnimating = false;

            const uniqueId = _uniqueId();

            const handleBtnBlur = () => {
              isBtnFocused = false;

              if (!isBtnHovered) {
                anime.remove(tint);
                anime({
                  complete: () => {
                    tint.style.transform = ``;
                    tint.style.fill = ``;
                  },
                  duration: 300,
                  easing: `easeInBack`,
                  targets: tint,
                  scale: 0,
                  fill: `rgb(249, 122, 98)`,
                });
              }
            };

            const handleBtnClick = () => {
              if (!isInnerAnimating) {
                const props = {
                  complete: () => {
                    if (!isAccordionActive) {
                      inner.removeAttribute(`style`);
                    }

                    isInnerAnimating = false;
                  },
                  duration: 500,
                  easing: `easeInOutSine`,
                  targets: inner,
                };

                isAccordionActive = !isAccordionActive;
                isInnerAnimating = true;

                elem.classList.toggle(`${_namespace}-active`);

                if (elem.classList.contains(`${_namespace}-active`)) {
                  anime({
                    ...props,
                    height: [0, _pxToRem(inner.scrollHeight)],
                  });
                } else {
                  anime({
                    ...props,
                    delay: 100,
                    height: [_pxToRem(inner.scrollHeight), 0],
                  });
                }
              }
            };

            const handleBtnFocus = () => {
              isBtnFocused = true;

              if (!isBtnHovered) {
                anime.remove(tint);
                anime({
                  duration: 800,
                  easing: `easeOutElastic(1, 0.6)`,
                  targets: tint,
                  scale: [0, 1],
                  fill: `rgb(249, 122, 98)`,
                });
              }
            };

            const handleBtnMouseEnter = () => {
              isBtnHovered = true;

              anime.remove(tint);

              if (isBtnFocused) {
                const timeline = anime.timeline({
                  duration: 300,
                  easing: `easeInOutCirc`,
                });

                timeline
                  .add(
                    {
                      duration: 200,
                      targets: tint,
                      fill: `rgba(249, 122, 98, 0.55)`,
                    },
                    0
                  )
                  .add(
                    {
                      begin: () => {
                        maskHidden.style.transformOrigin = `50% 50%`;
                      },
                      targets: maskHidden,
                      scale: [1, 0],
                    },
                    0
                  );
              } else {
                anime({
                  begin: () => {
                    maskHidden.style.transform = `scale(0)`;
                    maskHidden.style.transformOrigin = `50% 50%`;
                  },
                  duration: 800,
                  easing: `easeOutElastic(1, 0.6)`,
                  targets: tint,
                  scale: [0, 1],
                });
              }
            };

            const handleBtnMouseLeave = () => {
              isBtnHovered = false;

              anime.remove(tint);

              if (isBtnFocused) {
                const timeline = anime.timeline({
                  duration: 300,
                  easing: `easeInOutCirc`,
                });

                timeline
                  .add(
                    {
                      duration: 200,
                      targets: tint,
                      fill: `rgb(249, 122, 98)`,
                    },
                    100
                  )
                  .add(
                    {
                      targets: maskHidden,
                      scale: [`0`, `1`],
                    },
                    0
                  );
              } else {
                anime({
                  complete: () => {
                    maskHidden.removeAttribute(`style`);
                    tint.style.transform = ``;
                  },
                  duration: 300,
                  easing: `easeInBack`,
                  targets: tint,
                  scale: 0,
                });
              }
            };

            const handleWindowResize = () => {
              if (isAccordionActive) {
                inner.style.height = `auto`;
              }
            };

            mask.id = uniqueId;
            tint.style.mask = `url(#${uniqueId})`;

            btn.addEventListener(`blur`, handleBtnBlur, false);
            btn.addEventListener(`click`, handleBtnClick, false);
            btn.addEventListener(`focus`, handleBtnFocus, false);
            btn.addEventListener(`mouseenter`, handleBtnMouseEnter, false);
            btn.addEventListener(`mouseleave`, handleBtnMouseLeave, false);
            window.addEventListener(`resize`, handleWindowResize, false);
          });
        },
      },
      imgSlider: {
        className: `${_namespace}-img--slider`,
        fn: (elems) => {
          const loadImg = (URL, fn) => {
            const img = new Image();
            img.src = URL;
            img.onload = () => {
              fn();
            };
          };
          //
          elems.forEach((elem) => {
            let currentImg = 0;

            const imgs = [];
            const inner = elem.querySelector(`.${_namespace}-img__inner`);
            let slides = [
              ...elem.querySelectorAll(`.${_namespace}-img__slide`),
            ];

            slides.forEach((slide) => {
              const src = slide.querySelector(`.${_namespace}-img__src`);

              const img = {
                backgroundColor: src.dataset.backgroundColor,
                URL: src.src,
              };

              slide.innerHTML = ``;
              slide.style.backgroundColor = img.backgroundColor;

              imgs.push(img);
            });

            if (slides.length === 1) {
            } else {
              if (slides.length > 3) {
                inner.innerHTML = ``;

                for (let i = 0; i < 3; i++) {
                  const slide = slides[i];

                  inner.appendChild(slide);
                }

                slides = [
                  ...elem.querySelectorAll(`.${_namespace}-img__slide`),
                ];

                for (let i = 0; i < 3; i++) {
                  const img = imgs[i];
                  const slide = slides[i];

                  slide.style.backgroundImage = `url("${img.URL}")`;

                  if (i !== 0) {
                    slide.style.transform = `scale(0.95) rotate(${Math.random()}deg)`;
                  }
                }
              }
            }
          });
        },
      },
    };

    return {
      components,
      utils,
    };
  })();

  const _namespace = UpDS.utils.getNamespace();
  const _version = UpDS.utils.getVersion();

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

  const _addDefaultsToElems = (selector, ...tagNames) => {
    const entries = document.querySelectorAll(selector);

    if (!!entries.length) {
      entries.forEach((entry) => {
        const elems = entry.querySelectorAll([...tagNames]);

        elems.forEach((elem) => {
          const tagName = elem.tagName.toLowerCase();
          const defaultClassName = `${_namespace}-${tagName}`;

          if (!elem.classList.contains(defaultClassName)) {
            elem.classList.add(defaultClassName);
          }

          if (tagName === `a`) {
            // improve this, so that these attributes are
            // only added or modified if the href attribute
            // is pointing to an external URL.
            elem.rel = `noopener noreferrer`;
            elem.target = `_blank`;
          }
        });
      });
    } else {
      console.warn(`PiggyBack.js: Couldn't find a valid DOM entry.`);
    }
  };

  const _addStyleSheets = ([...URLs], fn) => {
    if (!_isPiggyBacked) {
      const addedCSS = [];
      const head = document.head;
      const style = document.createElement(`style`);

      _isPiggyBacked = true;

      style.textContent = `\n`;

      URLs.forEach((URL) => {
        if (addedCSS.indexOf(URL) === -1) {
          style.textContent += `\t@import "${URL}";\n`;
          addedCSS.push(URL);
        }
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
      _addDefaultsToElems(`#page-content`, ...CMSElements);
      _addComponents(UpDS.components);
    });
  };

  const version = () => {
    return _version;
  };

  return {
    run,
    version,
  };
})();
