import "DistributionPackages/Litefyr.Distribution/Resources/Private/Fusion/Inline";
import { customEvent } from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventDispatcher";
import setZIndex from "./Global/zIndex";

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
    customEvent("color-scheme", dark ? "dark" : "light");
}

function enableModeSwitcher() {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
    darkModePreference.addEventListener("change", () => {
        setClass();
    });

    window.darkMode = () => {
        if ("scheme" in localStorage) {
            return localStorage.scheme === "dark";
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
            localStorage.removeItem("scheme");
        } else {
            localStorage.scheme = mode;
        }
        setClass();
        customEvent("set-mode", mode);
        return mode;
    };

    setClass();
}

if (hasMulipleSchemes) {
    enableModeSwitcher();
}

if (htmlElement.classList.contains("content-clip--reverse")) {
    document.addEventListener("DOMContentLoaded", setZIndex);
}
