// import anime from 'animejs';

// const UpDS = (() => {
const state = {
  hasCSSVarSupport:
    !!typeof CSS !== `undefined` && CSS.supports(`color`, `var(--var)`),
};

const ns = `up`;
let uid = 0;
const ver = {
  name: ``,
  number: `v0.3.0`,
};

const animation = {
  misc: {
    fadeIn: (elems) => {
      anime.remove(elems);
      anime({
        duration: 500,
        easing: `easeInOutCirc`,
        opacity: 1,
        targets: elems,
      });
    },
  },
  tint: {
    focusToHover: (icon) => {
      const mask = icon.querySelector(`.${ns}-icon__mask--hidden`);
      const tint = icon.querySelector(`.${ns}-icon__tint`);

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
      const tint = icon.querySelector(`.${ns}-icon__tint`);

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
      const mask = icon.querySelector(`.${ns}-icon__mask--hidden`);
      const tint = icon.querySelector(`.${ns}-icon__tint`);

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
      const mask = icon.querySelector(`.${ns}-icon__mask--hidden`);
      const tint = icon.querySelector(`.${ns}-icon__tint`);

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
      const tint = icon.querySelector(`.${ns}-icon__tint`);

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
      const mask = icon.querySelector(`.${ns}-icon__mask--hidden`);
      const tint = icon.querySelector(`.${ns}-icon__tint`);

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

const pxToRem = (pixels, basePixels = 16) => {
  pixels = parseFloat(pixels);
  basePixels = parseFloat(basePixels);

  return `${pixels / basePixels}rem`;
};

const setIconMaskId = (icon) => {
  const mask = icon.querySelector(`.${ns}-icon__mask`);
  const tint = icon.querySelector(`.${ns}-icon__tint`);
  const id = uniqueId();

  mask.id = id;
  tint.style.mask = `url("#${id}")`;
};

const uniqueId = () => {
  return `${ns}-uid-${++uid}`;
};

const components = {
  accordion: {
    className: `${ns}-accordion`,
    fn: (elems) => {
      elems.forEach((elem) => {
        const state = {
          isActive: false,
          isAnimating: false,
          isFocused: false,
          isHovered: false,
        };

        const btn = elem.querySelector(`.${ns}-accordion__btn`);
        const icon = elem.querySelector(`.${ns}-icon`);
        const inner = elem.querySelector(`.${ns}-accordion__inner`);

        const handleBlur = () => {
          state.isFocused = false;

          if (!state.isHovered) {
            animation.tint.focusToStatic(icon);
          }
        };

        const handleClick = () => {
          if (!state.isAnimating) {
            state.isActive = !state.isActive;
            state.isAnimating = true;

            elem.classList.toggle(`${ns}-active`);

            if (state.isActive) {
              anime({
                begin: () => {
                  btn.ariaExpanded = true;
                  btn.title = `Contract`;
                  inner.style.visibility = `visible`;
                },
                complete: () => {
                  state.isAnimating = false;
                },
                duration: 500,
                easing: `easeInOutSine`,
                height: [0, pxToRem(inner.scrollHeight)],
                targets: inner,
              });
            } else {
              anime({
                complete: () => {
                  btn.ariaExpanded = false;
                  btn.title = `Expand`;
                  inner.removeAttribute(`style`);

                  state.isAnimating = false;
                },
                duration: 500,
                delay: 100,
                easing: `easeInOutSine`,
                targets: inner,

                height: [pxToRem(inner.scrollHeight), 0],
              });
            }
          }
        };

        const handleFocus = () => {
          state.isFocused = true;

          if (!state.isHovered) {
            animation.tint.staticToFocus(icon);
          }
        };

        const handleMouseEnter = () => {
          state.isHovered = true;

          if (state.isFocused) {
            animation.tint.focusToHover(icon);
          } else {
            animation.tint.staticToHover(icon);
          }
        };

        const handleMouseLeave = () => {
          state.isHovered = false;

          if (state.isFocused) {
            animation.tint.hoverToFocus(icon);
          } else {
            animation.tint.hoverToStatic(icon);
          }
        };

        const handleResize = () => {
          if (state.isActive) {
            inner.style.height = `auto`;
          }
        };

        setIconMaskId(icon);

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
    className: `${ns}-img--slider`,
    fn: (elems) => {
      const getSlideData = (elem) => {
        const slideData = [];
        const slides = [...elem.querySelectorAll(`.${ns}-img__slide`)];

        if (slides.length > 12) {
          slides.length = 12;
        }

        slides.forEach((slide) => {
          const src = slide.querySelector(`.${ns}-img__src`);
          const data = {
            altText: src.ariaLabel,
            backgroundColor: src.dataset.backgroundColor,
            URL: src.dataset.src,
          };

          src.removeAttribute(`data-background-color`);
          src.removeAttribute(`data-src`);

          slideData.push(data);
        });

        return slideData;
      };

      const loadImg = (URL, fn) => {
        const img = new Image();
        img.src = URL;
        img.addEventListener(`load`, fn, false);
      };

      const setIcon = (elem, state) => {
        const btnPrev = elem.querySelector(`.${ns}-img__btn--prev`);
        const btnNext = elem.querySelector(`.${ns}-img__btn--next`);
        const iconPrev = btnPrev.querySelector(`.${ns}-icon`);
        const iconNext = btnNext.querySelector(`.${ns}-icon`);

        if (state.slideNum === 0) {
          if (state.isHovered.btnPrev) {
            state.isHovered.btnPrev = false;

            animation.tint.hoverToStatic(iconPrev);
          } else if (state.isFocused.btnPrev) {
            state.isFocused.btnPrev = false;

            animation.tint.focusToStatic(iconPrev);
          }

          btnPrev.classList.add(`${ns}-img__btn--disabled`);
          btnPrev.disabled = true;
        } else {
          btnPrev.classList.remove(`${ns}-img__btn--disabled`);
          btnPrev.disabled = false;
        }

        if (state.slideNum === state.slideData.length - 1) {
          if (state.isHovered.btnNext) {
            state.isHovered.btnNext = false;

            animation.tint.hoverToStatic(iconNext);
          } else if (state.isFocused.btnNext) {
            state.isFocused.btnNext = false;

            animation.tint.focusToStatic(iconNext);
          }

          btnNext.classList.add(`${ns}-img__btn--disabled`);
          btnNext.disabled = true;
        } else {
          btnNext.classList.remove(`${ns}-img__btn--disabled`);
          btnNext.disabled = false;
        }
      };

      const setNum = (elem, state) => {
        const number = elem.querySelector(`.${ns}-img__number`);

        number.innerHTML =
          `<strong class="${ns}-strong">${state.slideNum + 1}</strong>` +
          ` of ` +
          `<strong class="${ns}-strong">${state.slideData.length}</strong>`;
      };

      const setSlide = (elem, state, initSlideNum) => {
        const inner = elem.querySelector(`.${ns}-img__inner`);

        if (typeof initSlideNum === `undefined`) {
          inner.innerHTML = ``;

          for (let i = 0; i < 4; i++) {
            const slide = state.slideData[i];

            if (!!slide) {
              inner.innerHTML +=
                `<div class="${ns}-img__slide" style="background-color: ${slide.backgroundColor}">` +
                `<div aria-label="${slide.altText}" class="${ns}-img__src" role="img" style="background-image: url('${slide.URL}');"></div>` +
                `</div>`;

              loadImg(slide.URL, () => {
                let src = elem.querySelectorAll(`.${ns}-img__src`)[i];

                animation.misc.fadeIn(src);
              });
            }
          }
        } else {
          const slideNext = state.slideData[initSlideNum + 4];
          const slidePrev = state.slideData[initSlideNum - 1];
          const slides = elem.querySelectorAll(`.${ns}-img__slide`);

          const addSlide = (cb) => {
            if (!!slidePrev) {
              if (slides[3]) {
                slides[3].remove();
              }

              const slide = document.createElement(`div`);
              slide.classList.add(`${ns}-img__slide`);
              slide.style.left = `-150%`;
              slide.style.backgroundColor = slidePrev.backgroundColor;

              slide.innerHTML = `<div aria-label="${slidePrev.altText}" class="${ns}-img__src" role="img" style="opacity: 1;background-image: url('${slidePrev.URL}');"></div>`;

              inner.prepend(slide);
            }

            cb();
          };

          if (initSlideNum > state.slideNum) {
            addSlide(() => {
              const timeline = anime.timeline({
                begin: () => {
                  state.isAnimating = true;
                },
                complete: () => {
                  state.isAnimating = false;
                },
                duration: 1000,
                easing: `easeInOutSine`,
              });

              timeline
                .add(
                  {
                    bottom: [pxToRem(`-40px`), pxToRem(`-8px`)],
                    boxShadow: [
                      `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 0.5rem 0.5rem -0.125rem rgba(34, 17, 65, 0.25)`,
                      `none`,
                    ],
                    duration: 500,
                    easing: `easeInBack`,
                    scale: [0.9025, 0.8145],
                    rotate: [`-0.55deg`, `0deg`],
                    targets: elem.querySelectorAll(`.${ns}-img__slide`)[3],
                  },
                  0
                )
                .add(
                  {
                    bottom: [pxToRem(`-24px`), pxToRem(`-40px`)],
                    boxShadow: [
                      `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 1rem 1rem -0.25rem rgba(34, 17, 65, 0.2)`,
                      `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 0.5rem 0.5rem -0.125rem rgba(34, 17, 65, 0.25)`,
                    ],
                    duration: 500,
                    easing: `easeInOutSine`,
                    scale: [0.95, 0.9025],
                    rotate: [`0.8deg`, `-0.55deg`],
                    targets: elem.querySelectorAll(`.${ns}-img__slide`)[2],
                  },
                  100
                )
                .add(
                  {
                    bottom: [pxToRem(`-8px`), pxToRem(`-24px`)],
                    boxShadow: [
                      `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 1.5rem 1.5rem -0.375rem rgba(34, 17, 65, 0.15)`,
                      `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 1rem 1rem -0.25rem rgba(34, 17, 65, 0.2)`,
                    ],
                    duration: 500,
                    easing: `easeInOutSine`,
                    scale: [1, 0.95],
                    rotate: [`0deg`, `0.8deg`],
                    targets: elem.querySelectorAll(`.${ns}-img__slide`)[1],
                  },
                  150
                )
                .add(
                  {
                    duration: 500,
                    easing: `easeOutCirc`,
                    left: [`-150%`, pxToRem(`-8px`)],
                    targets: elem.querySelectorAll(`.${ns}-img__slide`)[0],
                  },
                  0
                );
            });
          } else {
            const timeline = anime.timeline({
              begin: () => {
                state.isAnimating = true;
              },
              complete: () => {
                state.isAnimating = false;

                slides[0].remove();

                if (!!slideNext) {
                  inner.innerHTML +=
                    `<div class="${ns}-img__slide" style="background-color: ${slideNext.backgroundColor}">` +
                    `<div aria-label="${slideNext.altText}" class="${ns}-img__src" role="img" style="opacity: 1;background-image: url('${slideNext.URL}');"></div>` +
                    `</div>`;
                }
              },
              duration: 1000,
              easing: `easeInOutSine`,
            });

            timeline
              .add(
                {
                  duration: 500,
                  left: `-150%`,
                  targets: slides[0],
                },
                0
              )
              .add(
                {
                  bottom: [pxToRem(`-24px`), pxToRem(`-8px`)],
                  boxShadow: [
                    `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 1rem 1rem -0.25rem rgba(34, 17, 65, 0.2)`,
                    `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 1.5rem 1.5rem -0.375rem rgba(34, 17, 65, 0.15)`,
                  ],
                  duration: 500,
                  easing: `easeInOutSine`,
                  scale: [0.95, 1],
                  rotate: [`0.8deg`, `0deg`],
                  targets: slides[1],
                },
                100
              )
              .add(
                {
                  bottom: [pxToRem(`-40px`), pxToRem(`-24px`)],
                  boxShadow: [
                    `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 0.5rem 0.5rem -0.125rem rgba(34, 17, 65, 0.25)`,
                    `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 1rem 1rem -0.25rem rgba(34, 17, 65, 0.2)`,
                  ],
                  duration: 500,
                  easing: `easeInOutSine`,
                  scale: [0.9025, 0.95],
                  rotate: [`-0.55deg`, `0.8deg`],
                  targets: slides[2],
                },
                150
              )
              .add(
                {
                  bottom: [pxToRem(`-8px`), pxToRem(`-40px`)],
                  boxShadow: [
                    `none`,
                    `0 0 1.25rem 0.25rem rgba(152, 1, 1, 0.02), 0 0.5rem 0.5rem -0.125rem rgba(34, 17, 65, 0.25)`,
                  ],
                  duration: 500,
                  easing: `easeOutBack`,
                  scale: [0.8145, 0.9025],
                  rotate: [`0deg`, `-0.55deg`],
                  targets: slides[3],
                },
                200
              );
          }
        }

        setIcon(elem, state);
        setNum(elem, state);
      };

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
          slideNum: 0,
          slideData: getSlideData(elem),
        };

        const btns = elem.querySelectorAll(`.${ns}-img__btn`);
        const icons = elem.querySelectorAll(`.${ns}-icon`);

        const handleBlur = (e) => {
          if (e.target.classList.contains(`${ns}-img__btn--prev`)) {
            state.isFocused.btnPrev = false;

            if (!state.isHovered.btnPrev) {
              animation.tint.focusToStatic(icons[0]);
            }
          } else {
            state.isFocused.btnNext = false;

            if (!state.isHovered.btnNext) {
              animation.tint.focusToStatic(icons[1]);
            }
          }
        };

        const handleClick = (e) => {
          const btnPrev = elem.querySelector(`.${ns}-img__btn--prev`);
          const btnNext = elem.querySelector(`.${ns}-img__btn--next`);

          if (!state.isAnimating) {
            if (e.target.classList.contains(`${ns}-img__btn--prev`)) {
              if (state.slideNum !== 0) {
                setSlide(elem, state, state.slideNum--);
              }

              if (state.slideNum === 0) {
                btnNext.focus();
              }
            } else {
              if (state.slideNum + 1 <= state.slideData.length - 1) {
                setSlide(elem, state, state.slideNum++);
              }

              if (state.slideNum === state.slideData.length - 1) {
                btnPrev.focus();
              }
            }
          }
        };

        const handleFocus = (e) => {
          if (e.target.classList.contains(`${ns}-img__btn--prev`)) {
            state.isFocused.btnPrev = true;

            if (!state.isHovered.btnPrev) {
              animation.tint.staticToFocus(icons[0]);
            }
          } else {
            state.isFocused.btnNext = true;

            if (!state.isHovered.btnNext) {
              animation.tint.staticToFocus(icons[1]);
            }
          }
        };

        const handleMouseEnter = (e) => {
          const iconPrev = icons[0];
          const iconNext = icons[1];

          if (e.target.classList.contains(`${ns}-img__btn--prev`)) {
            state.isHovered.btnPrev = true;

            if (state.isFocused.btnPrev) {
              animation.tint.focusToHover(iconPrev);
            } else {
              animation.tint.staticToHover(iconPrev);
            }
          } else {
            state.isHovered.btnNext = true;

            if (state.isFocused.btnNext) {
              animation.tint.focusToHover(iconNext);
            } else {
              animation.tint.staticToHover(iconNext);
            }
          }
        };

        const handleMouseLeave = (e) => {
          const iconPrev = icons[0];
          const iconNext = icons[1];

          if (e.target.classList.contains(`${ns}-img__btn--prev`)) {
            state.isHovered.btnPrev = false;

            if (state.isFocused.btnPrev) {
              animation.tint.hoverToFocus(iconPrev);
            } else {
              animation.tint.hoverToStatic(iconPrev);
            }
          } else {
            state.isHovered.btnNext = false;

            if (state.isFocused.btnNext) {
              animation.tint.hoverToFocus(iconNext);
            } else {
              animation.tint.hoverToStatic(iconNext);
            }
          }
        };

        icons.forEach((icon) => {
          setIconMaskId(icon);
        });

        btns.forEach((btn) => {
          btn.addEventListener(`blur`, handleBlur, false);
          btn.addEventListener(`click`, handleClick, false);
          btn.addEventListener(`focus`, handleFocus, false);
          btn.addEventListener(`mouseenter`, handleMouseEnter, false);
          btn.addEventListener(`mouseleave`, handleMouseLeave, false);
        });

        setSlide(elem, state);
      });
    },
  },
  imgHero: {
    className: `${ns}-img--hero`,
    fn: (elems) => {
      elems.forEach((elem) => {
        const img = document.createElement(`img`);
        const outer = elem.querySelector(`.${ns}-img__outer`);
        const URL = outer.style.backgroundImage.slice(4, -1).replace(/"/g, ``);

        const handleLoad = (e) => {
          const colorThief = new ColorThief();
          const heading = elem.querySelector(`.${ns}-img__heading`);
          const subheading = elem.querySelector(`.${ns}-img__subheading`);
          const rgb = colorThief.getColor(e.target);
          let rgba = `rgba(`;

          rgb.forEach((val) => {
            rgba += `${val}, `;
          });

          rgba += `0.55)`;

          const headings = [heading];

          if (!!subheading) {
            headings.push(subheading);
          }

          const timeline = anime.timeline({
            begin: () => {
              headings.forEach((heading) => {
                heading.style.backgroundColor = rgba;
              });
            },
            duration: 1100,
          });

          timeline
            .add(
              {
                backgroundPosition: {
                  duration: 800,
                  easing: `easeOutSine`,
                  value: [`50% 0%`, `50% 50%`],
                },
                duration: 800,
                easing: `easeOutSine`,
                opacity: 1,
                targets: outer,
              },
              0
            )
            .add(
              {
                bottom: [`-5rem`, `0rem`],
                delay: anime.stagger(100),
                duration: 500,
                opacity: 1,
                targets: headings,
              },
              500
            );
        };

        img.src = URL;
        img.addEventListener(`load`, handleLoad, false);
      });
    },
  },
};

const addComponents = (selector, ...compNames) => {
  const entries = document.querySelectorAll(selector);
  let supportedCompNames = [];

  if (!!compNames.length) {
    compNames.forEach((compName) => {
      if (!!components[compName]) {
        supportedCompNames.push(compName);
      } else {
        console.error(`UpDS: "${compName}" is not a supported component.`);
      }
    });
  } else {
    supportedCompNames = Object.keys(components);
  }

  if (!!entries.length) {
    entries.forEach((entry) => {
      let prevCompdElemsCount = 0;

      supportedCompNames.forEach((supportedCompName) => {
        const elems = [
          ...entry.querySelectorAll(
            `.${components[supportedCompName].className}`
          ),
        ];

        if (!!elems.length) {
          const elemsToComp = [];
          const flagClassName = `${ns}-mounted`;

          elems.forEach((elem) => {
            if (!elem.classList.contains(flagClassName)) {
              elem.classList.add(flagClassName);
              elemsToComp.push(elem);
            } else {
              prevCompdElemsCount++;
            }
          });

          if (!!elemsToComp.length) {
            components[supportedCompName].fn(elemsToComp);
          }
        }
      });

      if (!!prevCompdElemsCount) {
        console.warn(
          `UpDS: addComponents() called on ${prevCompdElemsCount} previously componentised elements.`
        );
      }
    });
  } else {
    console.error(`UpDS: addComponents() couldn't find a valid DOM entry.`);
  }
};

const getNamespace = () => {
  return ns;
};

const getVersion = () => {
  return `${ver.name} ${ver.number}`;
};

const listComponents = () => {
  const comps = Object.keys(components);
  const compList = {};

  comps.forEach((comp) => {
    compList[comp] = components[comp].className;
  });

  return compList;
};

// return {
//   addComponents,
//   listComponents,
//   getNamespace,
//   getVersion,
// };
// })();

// export default UpDS

export { addComponents, getNamespace, getVersion, listComponents };
