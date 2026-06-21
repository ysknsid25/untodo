// untodo LP - minimal i18n loader.
// No build step: fetches a JSON dictionary and injects text into
// elements tagged with data-i18n="dotted.path". Falls back to
// English if Japanese (or any other locale file) fails to load.

(function () {
    "use strict";

    const SUPPORTED = ["ja", "en"];
    const DEFAULT_LOCALE = "en";

    function detectLocale() {
        const nav =
            navigator.language || navigator.userLanguage || DEFAULT_LOCALE;
        const short = nav.slice(0, 2).toLowerCase();
        return SUPPORTED.includes(short) ? short : DEFAULT_LOCALE;
    }

    function getByPath(obj, path) {
        return path.split(".").reduce((acc, key) => {
            if (acc && typeof acc === "object" && key in acc) return acc[key];
            return undefined;
        }, obj);
    }

    async function loadDictionary(locale) {
        const res = await fetch(`./i18n/${locale}.json`, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Failed to load ${locale}.json`);
        return res.json();
    }

    function applyDictionary(dict) {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const path = el.getAttribute("data-i18n");
            const value = getByPath(dict, path);
            if (typeof value === "string") {
                el.textContent = value;
            }
        });

        // repeated feature cards are rendered separately (see renderFeatures)
        if (Array.isArray(dict.features && dict.features.items)) {
            renderFeatures(dict.features.items);
        }

        if (dict.meta && dict.meta.title) {
            document.title = dict.meta.title;
        }
        if (dict.meta && dict.meta.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc)
                metaDesc.setAttribute("content", dict.meta.description);
        }
    }

    function renderFeatures(items) {
        const grid = document.querySelector(".features__grid");
        if (!grid) return;
        grid.innerHTML = "";
        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "feature-card";
            card.innerHTML = `
        <div class="feature-card__emoji" aria-hidden="true">${item.emoji}</div>
        <h3 class="feature-card__title">${item.title}</h3>
        <p class="feature-card__body">${item.body}</p>
      `;
            grid.appendChild(card);
        });
    }

    function updateLangToggleUI(locale) {
        document.querySelectorAll(".lang-toggle button").forEach((btn) => {
            btn.setAttribute(
                "aria-pressed",
                btn.dataset.locale === locale ? "true" : "false",
            );
        });
        document.documentElement.setAttribute("lang", locale);
    }

    async function setLocale(locale) {
        try {
            const dict = await loadDictionary(locale);
            applyDictionary(dict);
            updateLangToggleUI(locale);
            window.__untodoLocale = locale;
        } catch (err) {
            if (locale !== DEFAULT_LOCALE) {
                console.warn(`[i18n] falling back to ${DEFAULT_LOCALE}:`, err);
                setLocale(DEFAULT_LOCALE);
            } else {
                console.error("[i18n] failed to load default locale:", err);
            }
        }
    }

    function initLangToggle() {
        document.querySelectorAll(".lang-toggle button").forEach((btn) => {
            btn.addEventListener("click", () => setLocale(btn.dataset.locale));
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initLangToggle();
        setLocale(detectLocale());
    });
})();
