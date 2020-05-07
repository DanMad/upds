'use strict';

const PiggyBack = (() => {
  const UpDS = (() => {
    const _anime = {
      tint: {
        focusToHover: (icon) => {
          const mask = icon.querySelector(`.${_namespace}-icon__mask--hidden`);
          const tint = icon.querySelector(`.${_namespace}-icon__tint`);

          anime.remove(tint);

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
                  mask.style.transformOrigin = `50% 50%`;
                },
                targets: mask,
                scale: [1, 0],
              },
              0
            );
        },
        focusToStatic: (icon) => {
          const tint = icon.querySelector(`.${_namespace}-icon__tint`);

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
        },
        hoverToFocus: (icon) => {
          const mask = icon.querySelector(`.${_namespace}-icon__mask--hidden`);
          const tint = icon.querySelector(`.${_namespace}-icon__tint`);

          anime.remove(tint);

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
                targets: mask,
                scale: [`0`, `1`],
              },
              0
            );
        },
        hoverToStatic: (icon) => {
          const mask = icon.querySelector(`.${_namespace}-icon__mask--hidden`);
          const tint = icon.querySelector(`.${_namespace}-icon__tint`);

          anime.remove(tint);
          anime({
            complete: () => {
              mask.removeAttribute(`style`);
              tint.style.transform = ``;
            },
            duration: 300,
            easing: `easeInBack`,
            targets: tint,
            scale: 0,
          });
        },
        staticToFocus: (icon) => {
          const tint = icon.querySelector(`.${_namespace}-icon__tint`);

          anime.remove(tint);
          anime({
            duration: 800,
            easing: `easeOutElastic(1, 0.6)`,
            targets: tint,
            scale: [0, 1],
            fill: `rgb(249, 122, 98)`,
          });
        },
        staticToHover: (icon) => {
          const mask = icon.querySelector(`.${_namespace}-icon__mask--hidden`);
          const tint = icon.querySelector(`.${_namespace}-icon__tint`);

          anime.remove(tint);
          anime({
            begin: () => {
              mask.style.transform = `scale(0)`;
              mask.style.transformOrigin = `50% 50%`;
            },
            duration: 800,
            easing: `easeOutElastic(1, 0.6)`,
            targets: tint,
            scale: [0, 1],
          });
        },
      },
    };

    const _namespace = `up`;
    let _uniqueIdCount = 0;
    const _version = {
      name: `Moon Landing`,
      number: `v0.2.0`,
    };

    const _pxToRem = (pixels, basePixels = 16) => {
      pixels = parseFloat(pixels);
      basePixels = parseFloat(basePixels);

      return `${pixels / basePixels}rem`;
    };

    const _setIconMaskId = (icon) => {
      const mask = icon.querySelector(`.${_namespace}-icon__mask`);
      const tint = icon.querySelector(`.${_namespace}-icon__tint`);
      const id = _uniqueId();

      mask.id = id;
      tint.style.mask = `url(#${id})`;
    };

    const _uniqueId = () => {
      return `${_namespace}-id-${++_uniqueIdCount}`;
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
            const state = {
              isActive: false,
              isAnimating: false,
              isFocused: false,
              isHovered: false,
            };

            const btn = elem.querySelector(`.${_namespace}-accordion__btn`);
            const icon = elem.querySelector(`.${_namespace}-icon`);
            const inner = elem.querySelector(`.${_namespace}-accordion__inner`);

            const handleBlur = () => {
              state.isFocused = false;

              if (!state.isHovered) {
                _anime.tint.focusToStatic(icon);
              }
            };

            const handleClick = () => {
              if (!state.isAnimating) {
                const props = {
                  complete: () => {
                    if (!state.isActive) {
                      inner.removeAttribute(`style`);
                    }

                    state.isAnimating = false;
                  },
                  duration: 500,
                  easing: `easeInOutSine`,
                  targets: inner,
                };

                state.isActive = !state.isActive;
                state.isAnimating = true;

                elem.classList.toggle(`${_namespace}-active`);

                if (elem.classList.contains(`${_namespace}-active`)) {
                  anime({
                    begin: () => {
                      inner.style.visibility = `visible`;
                    },
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

            const handleFocus = () => {
              state.isFocused = true;

              if (!state.isHovered) {
                _anime.tint.staticToFocus(icon);
              }
            };

            const handleMouseEnter = () => {
              state.isHovered = true;

              if (state.isFocused) {
                _anime.tint.focusToHover(icon);
              } else {
                _anime.tint.staticToHover(icon);
              }
            };

            const handleMouseLeave = () => {
              state.isHovered = false;

              if (state.isFocused) {
                _anime.tint.hoverToFocus(icon);
              } else {
                _anime.tint.hoverToStatic(icon);
              }
            };

            const handleResize = () => {
              if (state.isActive) {
                inner.style.height = `auto`;
              }
            };

            _setIconMaskId(icon);

            btn.addEventListener(`blur`, handleBlur, false);
            btn.addEventListener(`click`, handleClick, false);
            btn.addEventListener(`focus`, handleFocus, false);
            btn.addEventListener(`mouseenter`, handleMouseEnter, false);
            btn.addEventListener(`mouseleave`, handleMouseLeave, false);

            window.addEventListener(`resize`, handleResize, false);
          });
        },
      },
      imgSlider: {
        className: `${_namespace}-img--slider`,
        fn: (elems) => {
          // const loadImg = (URL, fn) => {
          //   const img = new Image();
          //   img.src = URL;
          //   img.onload = () => {
          //     fn();
          //   };
          // };

          elems.forEach((elem) => {
            const state = {
              isAnimating: false,
              isFocused: {
                btnNext: false,
                btnPrev: false,
              },
              isHovered: {
                btnNext: false,
                btnPrev: false,
              },
            };

            const btns = elem.querySelectorAll(`.${_namespace}-img__btn`);
            const icons = elem.querySelectorAll(`.${_namespace}-icon`);

            const handleBlur = (e) => {
              const btn = e.target;
              let icon = icons[0];

              if (btn.classList.contains(`${_namespace}-img__btn--prev`)) {
                if (!state.isHovered.btnPrev) {
                  _anime.tint.focusToStatic(icon);
                }

                state.isFocused.btnPrev = false;
              } else {
                icon = icons[1];

                if (!state.isHovered.btnNext) {
                  _anime.tint.focusToStatic(icon);
                }

                state.isFocused.btnNext = false;
              }
            };

            const handleFocus = (e) => {
              const btn = e.target;
              let icon = icons[0];

              if (btn.classList.contains(`${_namespace}-img__btn--prev`)) {
                if (!state.isHovered.btnPrev) {
                  _anime.tint.staticToFocus(icon);
                }

                state.isFocused.btnPrev = true;
              } else {
                icon = icons[1];

                if (!state.isHovered.btnNext) {
                  _anime.tint.staticToFocus(icon);
                }

                state.isFocused.btnNext = true;
              }
            };

            const handleMouseEnter = (e) => {
              const btn = e.target;
              let icon = icons[0];

              if (btn.classList.contains(`${_namespace}-img__btn--prev`)) {
                if (state.isFocused.btnPrev) {
                  _anime.tint.focusToHover(icon);
                } else {
                  _anime.tint.staticToHover(icon);
                }

                state.isHovered.btnPrev = true;
              } else {
                icon = icons[1];

                if (state.isFocused.btnNext) {
                  _anime.tint.focusToHover(icon);
                } else {
                  _anime.tint.staticToHover(icon);
                }

                state.isHovered.btnNext = true;
              }
            };

            const handleMouseLeave = (e) => {
              const btn = e.target;
              let icon = icons[0];

              if (btn.classList.contains(`${_namespace}-img__btn--prev`)) {
                if (state.isFocused.btnPrev) {
                  _anime.tint.hoverToFocus(icon);
                } else {
                  _anime.tint.hoverToStatic(icon);
                }

                state.isHovered.btnPrev = false;
              } else {
                icon = icons[1];

                if (state.isFocused.btnNext) {
                  _anime.tint.hoverToFocus(icon);
                } else {
                  _anime.tint.hoverToStatic(icon);
                }

                state.isHovered.btnNext = false;
              }
            };

            icons.forEach((icon) => {
              _setIconMaskId(icon);
            });

            btns.forEach((btn) => {
              btn.addEventListener(`blur`, handleBlur, false);
              btn.addEventListener(`focus`, handleFocus, false);
              btn.addEventListener(`mouseenter`, handleMouseEnter, false);
              btn.addEventListener(`mouseleave`, handleMouseLeave, false);
            });

            // const imgs = [];
            // const inner = elem.querySelector(`.${_namespace}-img__inner`);
            // let slides = [
            //   ...elem.querySelectorAll(`.${_namespace}-img__slide`),
            // ];
            // const mask = elem.querySelector(`.${_namespace}-icon__mask`);
            // const maskHidden = elem.querySelector(
            //   `.${_namespace}-icon__mask--hidden`
            // );
            // const tint = elem.querySelector(`.${_namespace}-icon__tint`);
            // let isNextBtnFocused = false;
            // let isPrevBtnFocused = false;
            // let isNextBtnHovered = false;
            // let isPrevBtnHovered = false;
            // // let isInnerAnimating = false;
            // const setImgNumber = (currImg = 0) => {
            //   const number = elem.querySelector(`.${_namespace}-img__number`);
            //   number.innerHTML = `<strong class="${_namespace}-strong">${
            //     currImg + 1
            //   }</strong> of <strong class="${_namespace}-strong">${
            //     imgs.length
            //   }</strong>`;
            // };
            // const handleNextBtnMouseEnter = (e) => {
            //   isNextBtnHovered = true;
            //   console.log(e.target);
            //   anime.remove(tint);
            //   if (isNextBtnFocused) {
            //     const timeline = anime.timeline({
            //       duration: 300,
            //       easing: `easeInOutCirc`,
            //     });
            //     timeline
            //       .add(
            //         {
            //           duration: 200,
            //           targets: tint,
            //           fill: `rgba(249, 122, 98, 0.55)`,
            //         },
            //         0
            //       )
            //       .add(
            //         {
            //           begin: () => {
            //             maskHidden.style.transformOrigin = `50% 50%`;
            //           },
            //           targets: maskHidden,
            //           scale: [1, 0],
            //         },
            //         0
            //       );
            //   } else {
            //     anime({
            //       begin: () => {
            //         maskHidden.style.transform = `scale(0)`;
            //         maskHidden.style.transformOrigin = `50% 50%`;
            //       },
            //       duration: 800,
            //       easing: `easeOutElastic(1, 0.6)`,
            //       targets: tint,
            //       scale: [0, 1],
            //     });
            //   }
            // };
            // const handleNextBtnMouseLeave = () => {
            //   isNextBtnHovered = false;
            //   anime.remove(tint);
            //   if (isNextBtnFocused) {
            //     const timeline = anime.timeline({
            //       duration: 300,
            //       easing: `easeInOutCirc`,
            //     });
            //     timeline
            //       .add(
            //         {
            //           duration: 200,
            //           targets: tint,
            //           fill: `rgb(249, 122, 98)`,
            //         },
            //         100
            //       )
            //       .add(
            //         {
            //           targets: maskHidden,
            //           scale: [`0`, `1`],
            //         },
            //         0
            //       );
            //   } else {
            //     anime({
            //       complete: () => {
            //         maskHidden.removeAttribute(`style`);
            //         tint.style.transform = ``;
            //       },
            //       duration: 300,
            //       easing: `easeInBack`,
            //       targets: tint,
            //       scale: 0,
            //     });
            //   }
            // };
            // slides.forEach((slide) => {
            //   const src = slide.querySelector(`.${_namespace}-img__src`);
            //   const img = {
            //     backgroundColor: src.dataset.backgroundColor,
            //     URL: src.dataset.src,
            //   };
            //   slide.innerHTML = ``;
            //   slide.style.backgroundColor = img.backgroundColor;
            //   imgs.push(img);
            // });
            // setImgNumber();
            // if (slides.length === 1) {
            // } else {
            //   if (slides.length > 3) {
            //     inner.innerHTML = ``;
            //     for (let i = 0; i < 3; i++) {
            //       const slide = slides[i];
            //       inner.appendChild(slide);
            //     }
            //     slides = [
            //       ...elem.querySelectorAll(`.${_namespace}-img__slide`),
            //     ];
            //     for (let i = 0; i < 3; i++) {
            //       const img = imgs[i];
            //       const slide = slides[i];
            //       slide.style.backgroundImage = `url("${img.URL}")`;
            //       // if (i !== 0) {
            //       //   slide.style.transform = `scale(0.95) rotate(${Math.random()}deg)`;
            //       // }
            //     }
            //   }
            // }
            // const prevBtn = elem.querySelector(`.${_namespace}-img__btn--prev`);
            // prevBtn.addEventListener(
            //   `mouseenter`,
            //   handleNextBtnMouseEnter,
            //   false
            // );
            // prevBtn.addEventListener(
            //   `mouseleave`,
            //   handleNextBtnMouseLeave,
            //   false
            // );
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
        const elemsToPiggyBack = [];
        const piggyBackClassName = `${_namespace}-piggybacked`;

        elems.forEach((elem) => {
          if (!elem.classList.contains(piggyBackClassName)) {
            elem.classList.add(piggyBackClassName);
            elemsToPiggyBack.push(elem);
          }
        });

        if (!!elemsToPiggyBack.length) {
          comps[compName].fn(elemsToPiggyBack);
        }
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
            const originURL = /((?:https?|ftp):\/\/(www\.)?)?(lucent\.baseux)\.com\/?/;

            // If href URL is external
            if (!originURL.test(elem.href)) {
              elem.rel = `noopener noreferrer`;
              elem.target = `_blank`;
            }
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
    return `${_version.name} ${_version.number}`;
  };

  return {
    run,
    version,
  };
})();
