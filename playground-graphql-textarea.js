/*
 * ClarusWMS docs enhancement: upgrade the API playground's GraphQL `query`
 * field from a single-line <input> to a multi-line, full-width <textarea>, and
 * pretty-print the query on first render.
 *
 * Mintlify has no native GraphQL support and renders the `query` string field
 * (tagged `format: textarea`) as a one-line input, which is painful for long
 * queries. This script:
 *   - converts those fields to a real textarea, stacked full-width below the
 *     field name/description,
 *   - keeps the value in sync with React's controlled state (so edits are sent),
 *   - formats the (often single-line) prefilled query into an indented block.
 *
 * It is deliberately defensive: only fields whose Mintlify pill says
 * `string<textarea>` are touched, and any failure is swallowed so the page
 * degrades to the default single-line input. Relies on Mintlify's internal DOM,
 * so re-check after Mintlify upgrades.
 */
(function () {
  "use strict";

  var PROCESSED = "data-gql-textarea";
  var PILL_TEXT = "string<textarea>";
  var TEXTAREA_CLASS =
    "px-3.5 flex-1 min-w-0 bg-transparent outline-0 text-playground-input resize-y font-mono text-xs";

  // Lightweight GraphQL pretty-printer: reflows by brace depth, one field per
  // line, leaving argument lists `( ... )` on their own line. Idempotent
  // (collapses whitespace first). Falls back to the original string on error.
  function formatGraphQL(src) {
    try {
      if (typeof src !== "string" || !src.trim()) return src;
      var s = src.replace(/\s+/g, " ").trim();
      var out = "", depth = 0, paren = 0, IND = "  ";
      function pad() { return new Array(depth + 1).join(IND); }
      function nl() { out = out.replace(/[ \t]+$/, "") + "\n" + pad(); }
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (c === "(") { paren++; out += c; }
        else if (c === ")") { paren = Math.max(0, paren - 1); out += c; }
        else if (paren > 0) { out += c; }
        else if (c === "{") { if (out && !/\s$/.test(out)) out += " "; out += "{"; depth++; nl(); }
        else if (c === "}") { depth = Math.max(0, depth - 1); nl(); out += "}"; }
        else if (c === " " || c === ",") {
          var n = s[i + 1];
          if (n === "{" || n === "}" || n === ")" || n === undefined) { /* keep on same line */ }
          else if (out && !/\n[ \t]*$/.test(out)) nl();
        } else { out += c; }
      }
      return out.replace(/[ \t]+$/, "").replace(/\n{2,}/g, "\n");
    } catch (e) {
      return src;
    }
  }

  // React-aware value setter so onChange fires and the request body updates.
  function setReactInputValue(input, value) {
    var proto = window.HTMLInputElement && window.HTMLInputElement.prototype;
    var desc = proto && Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) desc.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function enhanceField(pill) {
    try {
      if ((pill.textContent || "").replace(/\s+/g, "") !== PILL_TEXT) return;

      var block =
        pill.closest('[data-testid^="api-input-"]') ||
        pill.closest(".space-y-2") ||
        pill.parentElement;
      if (!block) return;

      var input =
        block.querySelector('input#api-playground-input[type="text"]') ||
        block.querySelector('input[type="text"]');
      if (!input || input.getAttribute(PROCESSED) === "1") return;

      var wrapper = pill.closest('[data-testid^="api-input-"]');

      // Safety: if this field already has our textarea, just adopt the input.
      if (wrapper) {
        var existing = wrapper.querySelector("textarea[" + PROCESSED + '="1"]');
        if (existing) {
          input.setAttribute(PROCESSED, "1");
          input.style.display = "none";
          existing._gqlInput = input;
          input._gqlTextarea = existing;
          return;
        }
      }

      var ta = document.createElement("textarea");
      ta.className = TEXTAREA_CLASS;
      ta.setAttribute("rows", "10");
      ta.setAttribute("spellcheck", "false");
      ta.setAttribute("autocapitalize", "off");
      ta.setAttribute("autocomplete", "off");
      ta.setAttribute("autocorrect", "off");
      ta.setAttribute(PROCESSED, "1");
      ta.setAttribute("aria-label", input.getAttribute("aria-label") || "Enter query");
      ta.placeholder = input.getAttribute("placeholder") || "Enter query";
      ta.style.width = "100%";

      var formatted = formatGraphQL(input.value);
      ta.value = formatted;

      ta.addEventListener("input", function () {
        try { setReactInputValue(input, ta.value); } catch (e) {}
      });

      input.setAttribute(PROCESSED, "1");
      input._gqlTextarea = ta;
      ta._gqlInput = input;

      // Layout: stack the full-width textarea below the field name + description.
      var leftCol = pill.closest(".space-y-2");
      if (wrapper) {
        var rightCol = input;
        while (rightCol.parentElement && rightCol.parentElement !== wrapper) {
          rightCol = rightCol.parentElement;
        }
        if (rightCol.parentElement === wrapper) rightCol.style.display = "none";
        if (leftCol) leftCol.style.gridColumn = "1 / -1";
        ta.style.gridColumn = "1 / -1";
        wrapper.appendChild(ta);
      } else {
        input.style.display = "none";
        input.insertAdjacentElement("afterend", ta);
      }

      // Make the rendered (and sent) value match the formatted text.
      if (formatted && formatted !== input.value) {
        try { setReactInputValue(input, formatted); } catch (e) {}
      }
    } catch (e) {
      /* fail safe: leave the native input untouched */
    }
  }

  function resyncValues() {
    try {
      var areas = document.querySelectorAll("textarea[" + PROCESSED + '="1"]');
      for (var i = 0; i < areas.length; i++) {
        var ta = areas[i];
        var input = ta._gqlInput;
        if (!input || !input.isConnected) continue;
        // Reflect React-driven changes (prefill, reset, op switch) unless typing.
        if (document.activeElement !== ta && ta.value !== input.value) {
          ta.value = formatGraphQL(input.value);
        }
      }
    } catch (e) {}
  }

  function run() {
    try {
      var pills = document.querySelectorAll('[data-component-part="field-info-pill"]');
      for (var i = 0; i < pills.length; i++) enhanceField(pills[i]);
      resyncValues();
    } catch (e) {}
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      run();
    }, 120);
  }

  function init() {
    try {
      run();
      if (window.MutationObserver) {
        new MutationObserver(schedule).observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
      window.addEventListener("popstate", schedule);
      window.addEventListener("hashchange", schedule);
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
