'use strict';

// UP Module to reference in application
const UP = (() => {
  const foo = (str) => {
    alert(str);
  };

  return {
    foo,
  };
})();

(() => {
  // IIFE for application
})();
