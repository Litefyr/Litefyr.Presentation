import "DistributionPackages/Litespeed.Distribution/Resources/Private/Fusion/Inline";

const htmlElement = document.documentElement;
const computedStyle = getComputedStyle(htmlElement);
const metaTheme = {
    element: document.querySelector('[name="theme-color"]'),
    scheme: document.querySelector('[name="color-scheme"]')?.getAttribute("content"),
    light: computedStyle.getPropertyValue("--color-theme-light"),
    dark: computedStyle.getPropertyValue("--color-theme-dark"),
};
const hasMulipleSchemes = metaTheme?.scheme === "light dark";
const defaultMode = metaTheme.scheme ? (metaTheme.scheme.includes("light") ? "light" : "dark") : "light";
const defaultModeIsDark = defaultMode === "dark";

window.darkMode = () => defaultModeIsDark;
window.setMode = () => "system";

function setClass() {
    const dark = darkMode();
    htmlElement.classList.toggle("light", !dark);
    htmlElement.classList.toggle("dark", dark);
    metaTheme.element?.setAttribute("content", metaTheme[dark ? "dark" : "light"]);
}

function enableModeSwitcher() {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
    darkModePreference.addEventListener("change", () => {
        setClass();
    });

    window.darkMode = () => {
        if ("theme" in localStorage) {
            return localStorage.theme === "dark";
        }
        if (defaultModeIsDark || darkModePreference.matches) {
            return true;
        }
        return false;
    };

    window.setMode = (mode) => {
        const system = mode === "system";
        if (system) {
            // Whenever the user explicitly chooses to respect the OS preference
            localStorage.removeItem("theme");
        } else {
            localStorage.theme = mode;
        }
        setClass();
        window.dispatchEvent(new CustomEvent("set-mode", { detail: mode }));
        return mode;
    };

    setClass();
}

if (hasMulipleSchemes) {
    enableModeSwitcher();
}

if (!computedStyle.getPropertyValue("--clippath-height")) {
    // Remove some clippath classes if heihgt is not set
    window.addEventListener("DOMContentLoaded", () => {
        ["clippath-top", "clippath-bottom", "clippath-inside"].forEach((className) => {
            // @ts-ignore
            [...document.querySelectorAll(`.${className}`)].forEach((element) => {
                element.classList.remove(className);
            });
        });
    });
}
