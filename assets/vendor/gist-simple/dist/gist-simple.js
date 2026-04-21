/*!
 * Gist Simple v2.1.0 (https://github.com/nk-o/gist-simple)
 * Copyright 2024 nK <https://nkdev.info>
 * Licensed under MIT (https://github.com/nk-o/gist-simple/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.gistSimple = factory());
})(this, (function () { 'use strict';

  /**
   * Document ready callback.
   * @param {Function} callback - callback will be fired once Document ready.
   */
  function ready(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Already ready or interactive, execute callback
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback, {
        capture: true,
        once: true,
        passive: true
      });
    }
  }

  /* eslint-disable import/no-mutable-exports */
  /* eslint-disable no-restricted-globals */
  let win;
  if (typeof window !== 'undefined') {
    win = window;
  } else if (typeof global !== 'undefined') {
    win = global;
  } else if (typeof self !== 'undefined') {
    win = self;
  } else {
    win = {};
  }
  var global$1 = win;

  /**
   * Extend like jQuery.extend
   *
   * @param {Object} out - output object.
   * @param {...any} args - additional objects to extend.
   *
   * @returns {Object}
   */
  function extend(out, ...args) {
    out = out || {};
    Object.keys(args).forEach(i => {
      if (!args[i]) {
        return;
      }
      Object.keys(args[i]).forEach(key => {
        out[key] = args[i][key];
      });
    });
    return out;
  }

  // Deferred
  // thanks http://stackoverflow.com/questions/18096715/implement-deferred-object-without-using-jquery
  function Deferred() {
    this.doneCallbacks = [];
    this.failCallbacks = [];
  }
  Deferred.prototype = {
    execute(list, args) {
      let i = list.length;
      // eslint-disable-next-line no-param-reassign
      args = Array.prototype.slice.call(args);
      while (i) {
        i -= 1;
        list[i].apply(null, args);
      }
    },
    resolve(...args) {
      this.execute(this.doneCallbacks, args);
    },
    reject(...args) {
      this.execute(this.failCallbacks, args);
    },
    done(callback) {
      this.doneCallbacks.push(callback);
    },
    fail(callback) {
      this.failCallbacks.push(callback);
    }
  };

  /**
   * Load JSONP url with callback.
   *
   * @thanks https://gist.github.com/gf3/132080/110d1b68d7328d7bfe7e36617f7df85679a08968
   */
  const NAME_FLAG = '__gist_simple_jsonp__';
  function loadJSONP(url, params) {
    const {
      data = {},
      beforeSend,
      success
    } = params;
    window[NAME_FLAG] = (window[NAME_FLAG] || 0) + 1;

    // Add callback function name.
    data.callback = `${NAME_FLAG}_cb_${window[NAME_FLAG]}`;

    // Add params to URL.
    Object.keys(data).forEach(k => {
      if (url.match(/\?/)) {
        url += `&${k}=${data[k]}`;
      } else {
        url += `?${k}=${data[k]}`;
      }
    });
    if (beforeSend && !beforeSend()) {
      return;
    }

    // Create script
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Setup handler
    window[data.callback] = function (response) {
      success.call(window, response);
      document.head.removeChild(script);
      script = null;
      delete window[data.callback];
    };

    // Load JSON
    document.head.appendChild(script);
  }

  /**
   * Load CSS with callback
   */
  const LOADED_FLAG = '__gist_simple_css_loaded__';
  function loadCSS(url, callback, doc = document) {
    const searchRoot = doc.body || doc.head || doc.documentElement;

    // Already exists.
    let el = searchRoot.querySelector(`link[href="${url}"]`);
    if (!el) {
      el = doc.createElement('link');
      el.href = url;
      el.rel = 'stylesheet';
      el.type = 'text/css';
      doc.head.appendChild(el);
    }
    if (callback) {
      // Is loaded already.
      if (el[LOADED_FLAG]) {
        callback(el);
        return;
      }

      // Add listener.
      el.addEventListener('load', () => {
        el[LOADED_FLAG] = true;
        callback(el);
      }, false);
    }
  }

  var iconArrow = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 44\" style=\"height: 15px; position: relative; top: 2px;\">\n  <path fill=\"#bbb\" fill-rule=\"evenodd\"\n    d=\"M8.0066 16.05305v-7.6523c0-.82422-.47656-1.0273-1.0586-.4414l-3.5117 3.5039c-1.8789 1.875-4.6953-.94142-2.8164-2.8164L8.7215.61564c.68359-.67579 1.8008-.6797 2.4922 0l8.1641 8.0312c1.8789 1.875-.9375 4.6914-2.8164 2.8164l-3.5078-3.5039c-.58984-.58985-1.0625-.38673-1.0625.4414v27.30827c0 .82031.47656 1.0273 1.0586.44141l3.5117-3.5039c1.8789-1.875 4.6953.9375 2.8164 2.8164l-8.1016 8.0273c-.6836.6797-1.8008.6797-2.4922 0l-8.1641-8.0273c-1.8789-1.8789.9375-4.6914 2.8164-2.8164l3.5078 3.5039c.58984.58984 1.0625.38672 1.0625-.4414V16.05304z\" />\n</svg>";

  var defaults = {
    id: '',
    theme: 'system',
    file: '',
    caption: '',
    lines: '',
    linesExpanded: false,
    highlightLines: '',
    showFooter: true,
    showLineNumbers: true,
    enableCache: true,
    onInit: null,
    // () => {}
    onInitEnd: null,
    // () => {}
    onDestroy: null,
    // () => {}
    onDestroyEnd: null,
    // () => {}
    onAjaxBeforeSend: null,
    // () => {}
    onAjaxSuccess: null,
    // (response) => {}
    onAjaxLoaded: null // () => {}
  };

  const cache = {};
  let instanceID = 0;
  const loadingIcon = '<span class="gist-simple-loading-icon"><i></i><i></i><i></i></span>';

  // Gist Simple class
  class GistSimple {
    constructor(container, userOptions) {
      const self = this;
      self.instanceID = instanceID;
      instanceID += 1;
      self.$container = container;
      self.defaults = {
        ...defaults
      };

      // prepare data-options
      const dataOptions = self.$container.dataset || {};
      const pureDataOptions = {};
      Object.keys(dataOptions).forEach(key => {
        if (key && typeof self.defaults[key] !== 'undefined') {
          pureDataOptions[key] = dataOptions[key];
        }
      });
      self.options = extend({}, self.defaults, pureDataOptions, userOptions);
      self.pureOptions = extend({}, self.options);

      // prepare 'true' and 'false' strings to boolean
      Object.keys(self.options).forEach(key => {
        if (self.options[key] === 'true') {
          self.options[key] = true;
        } else if (self.options[key] === 'false') {
          self.options[key] = false;
        }
      });
      self.init();
    }
    init() {
      const self = this;
      const {
        options
      } = self;
      const url = `https://gist.github.com/${options.id}.json`;
      const {
        lines
      } = options;
      const data = {};

      // call onInit event
      if (self.options.onInit) {
        self.options.onInit.call(self);
      }
      if (options.file) {
        data.file = options.file;
      }
      self.$container.classList.add('gist-simple');
      if (options.theme === 'dark' || options.theme === 'system') {
        self.$container.classList.add(`gist-simple-${options.theme}`);
      }

      // if the id doesn't exist, then ignore the code block
      if (!options.id) {
        self.insertContent('Gist ID is required', true);
        return;
      }
      const cacheUrl = url + options.file;
      const enableCache = options.enableCache || cache[cacheUrl];

      // show preloader.
      self.insertContent(loadingIcon, true);
      function insertGist(response) {
        // reference to div
        const $responseDiv = document.createElement('div');
        $responseDiv.innerHTML = response.div;

        // remove id for uniqueness constraints
        if ($responseDiv.firstChild) {
          $responseDiv.firstChild.removeAttribute('id');
        }
        self.insertContent($responseDiv.innerHTML);

        // highlight lines
        self.highlightLines(options.highlightLines);

        // show only specific lines
        self.showSpecificLines(lines, options.linesExpanded);

        // show caption
        self.showCaption(options.caption);

        // remove footer
        if (!options.showFooter) {
          self.removeFooter();
        }

        // remove line numbers
        if (!options.showLineNumbers) {
          self.removeLineNumbers();
        }

        // call onAjaxLoaded event
        if (self.options.onAjaxLoaded) {
          self.options.onAjaxLoaded.call(self, response);
        }
      }
      function successCallback(response) {
        // the html payload is in the div property
        if (response && response.div) {
          let {
            stylesheet
          } = response;

          // github returns /assets/embed-id.css now, but let's be sure about that
          if (stylesheet) {
            // github passes down html instead of a url for the stylesheet now
            // parse off the href
            if (stylesheet.indexOf('<link') === 0) {
              stylesheet = stylesheet.replace(/\\/g, '').match(/href="([^\s]*)"/);
              [stylesheet] = stylesheet;
            } else if (stylesheet.indexOf('http') !== 0) {
              // add leading slash if missing
              if (stylesheet.indexOf('/') !== 0) {
                stylesheet = `/${stylesheet}`;
              }
              stylesheet = `https://gist.github.com${stylesheet}`;
            }

            // Insert gist only after CSS loaded.
            loadCSS(stylesheet, () => {
              insertGist(response);
            }, self.$container.ownerDocument);
          } else {
            insertGist(response);
          }
        } else {
          self.insertContent(`Failed loading gist ${url}`, true);
        }
      }
      function errorCallBack(textStatus) {
        self.insertContent(`Failed loading gist ${url}: ${textStatus}`, true);
      }

      // request the json version of this gist
      loadJSONP(url, {
        data,
        beforeSend() {
          // call onAjaxBeforeSend event
          if (self.options.onAjaxBeforeSend) {
            self.options.onAjaxBeforeSend.call(self);
          }

          // option to enable caching of the gists
          if (enableCache) {
            if (cache[cacheUrl]) {
              // Cached response.
              if (cache[cacheUrl].div) {
                successCallback(cache[cacheUrl]);
                return false;
              }

              // loading the response from cache and preventing the ajax call
              cache[cacheUrl].done(response => {
                successCallback(response);
              });
              cache[cacheUrl].fail(errorStatus => {
                errorCallBack(errorStatus);
              });
              return false;
            }

            // saving the promise for the requested json as a proxy for the actual response
            cache[cacheUrl] = new Deferred();
          }
          return true;
        },
        success(response) {
          // call onAjaxSuccess event
          if (self.options.onAjaxSuccess) {
            self.options.onAjaxSuccess.call(self, response);
          }
          if (enableCache) {
            if (cache[cacheUrl] && cache[cacheUrl].resolve) {
              cache[cacheUrl].resolve(response);
              cache[cacheUrl] = response;
            }
          }
          successCallback(response);
        },
        error(textStatus) {
          errorCallBack(textStatus);
        }
      });

      // call onInitEnd event
      if (self.options.onInitEnd) {
        self.options.onInitEnd.call(self);
      }
    }
    destroy() {
      const self = this;

      // call onDestroy event
      if (self.options.onDestroy) {
        self.options.onDestroy.call(self);
      }

      // remove content
      self.$container.innerHTML = '';

      // delete GistSimple instance from container
      delete self.$container.GistSimple;

      // call onDestroyEnd event
      if (self.options.onDestroyEnd) {
        self.options.onDestroyEnd.call(self);
      }
    }

    // eslint-disable-next-line class-methods-use-this
    chunkBy(items, predicate) {
      if (items.length === 0) {
        return [];
      }
      return items.slice(1).reduce((chunked, item) => {
        if (predicate(item)) {
          chunked.push([item]);
        } else {
          chunked.push(chunked.pop().concat([item]));
        }
        return chunked;
      }, [items.slice(0, 1)]);
    }

    // eslint-disable-next-line class-methods-use-this
    getLineNumbers(lineRangeString) {
      const lineNumbers = [];
      let range;
      let lineNumberSections;
      if (typeof lineRangeString === 'number') {
        lineNumbers.push(lineRangeString);
      } else {
        lineNumberSections = lineRangeString.split(',');
        for (let i = 0; i < lineNumberSections.length; i += 1) {
          range = lineNumberSections[i].split('-');
          if (range.length === 2) {
            for (let j = parseInt(range[0], 10); j <= range[1]; j += 1) {
              lineNumbers.push(j);
            }
          } else if (range.length === 1) {
            lineNumbers.push(parseInt(range[0], 10));
          }
        }
      }
      return lineNumbers;
    }

    // insert content.
    insertContent(content, wrapper = false) {
      if (wrapper) {
        content = `<div class="gist-simple-wrap">${content}</div>`;
      }
      this.$container.innerHTML = content;
    }

    // highlight lines.
    highlightLines(lines) {
      if (!lines) {
        return;
      }
      const highlightLineNumbers = this.getLineNumbers(lines);

      // we need to set the line-data td to 100% so the highlight expands the whole line
      this.$container.querySelectorAll('td.line-data').forEach(el => {
        el.style.width = '100%';
      });

      // find all .js-file-line tds (actual code lines) that match the highlightLines and add the highlight class
      this.$container.querySelectorAll('.js-file-line').forEach((el, index) => {
        if (highlightLineNumbers.indexOf(index + 1) !== -1) {
          el.classList.add('gist-simple-highlighted-line');
        }
      });
    }

    // show only specific lines.
    // value example: "2", "1-5", "1,4", "1,4,6-8"
    showSpecificLines(lines, linesExpanded) {
      if (!lines) {
        return;
      }
      const lineNumbers = this.getLineNumbers(lines);
      const collapsableLineNumbers = [];

      // find all trs containing code lines that don't exist in the line param
      this.$container.querySelectorAll('.js-file-line').forEach((el, index) => {
        if (lineNumbers.indexOf(index + 1) === -1) {
          if (linesExpanded) {
            collapsableLineNumbers.push(index + 1);
            el.parentNode.style.display = 'none';
          } else {
            el.parentNode.remove();
          }
        }
      });

      // option to expand highlight lines and collapse hidden lines
      if (linesExpanded) {
        const collapsableBlocks = this.chunkBy(collapsableLineNumbers, line => !collapsableLineNumbers.includes(line - 1));
        collapsableBlocks.forEach(block => {
          const firstLine = block[0];
          const lineBeforeFirstLine = firstLine - 1;
          const lastLine = block[block.length - 1];
          const $collapsibleIcon = document.createElement('a');
          $collapsibleIcon.setAttribute('lines', block.join());
          $collapsibleIcon.style.display = 'block';
          $collapsibleIcon.style.cursor = 'pointer';
          $collapsibleIcon.innerHTML = iconArrow;
          $collapsibleIcon.addEventListener('click', event => {
            event.preventDefault();
            $collapsibleIcon.closest('table.highlight').querySelectorAll('tr[style*="display: none"] td[data-line-number]').forEach(function ($element) {
              const foundLines = $collapsibleIcon.getAttribute('lines').split(',');
              const lineNumber = $element.getAttribute('data-line-number');
              if (foundLines.indexOf(lineNumber) === -1) {
                return;
              }
              $element.parentNode.style.display = '';
            });
            $collapsibleIcon.closest('tr').remove();
          });
          const lineNumberElement = `
          <td class="blob-num js-line-number collapsed"><!-- Icon Here --></td>
        `;
          const lineCodeElement = `
          <td class="blob-code blob-code-inner js-file-line collapsed">... Lines ${firstLine} - ${lastLine}</td>
        `;
          const $lineElement = document.createElement('tr');
          $lineElement.innerHTML = lineNumberElement + lineCodeElement;
          $lineElement.querySelector('td:first-child').append($collapsibleIcon);
          const $line = this.$container.querySelector(`.js-line-number[data-line-number="${lineBeforeFirstLine === 0 ? 1 : lineBeforeFirstLine}"]`);
          if ($line) {
            if (lineBeforeFirstLine === 0) {
              $line.parentElement.before($lineElement);
            } else {
              $line.parentElement.after($lineElement);
            }
          }
        });
      }
    }

    // show caption.
    showCaption(caption) {
      if (!caption) {
        return;
      }
      const tbody = this.$container.querySelector('table tbody');
      const $row = document.createElement('tr');
      const $captionColumn = document.createElement('td');
      $row.classList.add('gist-simple-caption');
      $captionColumn.innerHTML = caption;
      const $rowBorder = document.createElement('td');
      $row.append($rowBorder);
      $row.append($captionColumn);
      tbody.prepend($row);
    }

    // remove footer.
    removeFooter() {
      this.$container.querySelector('.gist-meta').remove();

      // present a uniformed border when footer is hidden
      this.$container.querySelector('.gist-data').style.borderBottom = '0px';
      this.$container.querySelector('.gist-file').style.borderBottom = '1px solid #ddd';
    }

    // remove line numbers.
    removeLineNumbers() {
      this.$container.querySelectorAll('.js-line-number').forEach(el => {
        el.remove();
      });
      this.$container.querySelector('table.highlight').style.width = '100%';
    }
  }

  // global definition
  const gistSimple = function (items, options, ...args) {
    // check for dom element
    // thanks: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    if (typeof HTMLElement === 'object' ? items instanceof HTMLElement : items && typeof items === 'object' && items !== null && items.nodeType === 1 && typeof items.nodeName === 'string') {
      items = [items];
    }
    const len = items.length;
    let k = 0;
    let ret;
    for (k; k < len; k += 1) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        if (!items[k].GistSimple) {
          items[k].GistSimple = new GistSimple(items[k], options);
        }
      } else if (items[k].GistSimple) {
        // eslint-disable-next-line prefer-spread
        ret = items[k].GistSimple[options].apply(items[k].GistSimple, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return items;
  };
  gistSimple.constructor = GistSimple;

  const $ = global$1.jQuery;

  // jQuery support
  if (typeof $ !== 'undefined') {
    const $Plugin = function (...args) {
      Array.prototype.unshift.call(args, this);
      const res = gistSimple.apply(global$1, args);
      return typeof res !== 'object' ? res : this;
    };
    $Plugin.constructor = gistSimple.constructor;

    // no conflict
    const old$Plugin = $.fn.gistSimple;
    $.fn.gistSimple = $Plugin;
    $.fn.gistSimple.noConflict = function () {
      $.fn.gistSimple = old$Plugin;
      return this;
    };
  }

  // dom ready initialization
  ready(() => {
    gistSimple(document.querySelectorAll('.gist-simple[data-id]'));
  });

  return gistSimple;

}));
//# sourceMappingURL=gist-simple.js.map
