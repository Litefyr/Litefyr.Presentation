import Alpine from "alpinejs";
import { merge } from "ts-deepmerge";
import { rafInterval, rafTimeOut } from "./requestAnimationFrame";

const location = window.location;
const fullUrl = getFullUrl(location);

function getFullUrl(loc: Location | URL) {
    if (loc.pathname === "/neos/preview") {
        return loc.href;
    }
    const url = loc.origin + loc.pathname;
    return url.endsWith("/") ? url : url + "/";
}

function getFullHref(input) {
    if (typeof input != "string") {
        input = input?.dataset?.pswpSrc || input.getAttribute("href");
    }
    return getFullUrl(new URL(input, location.origin));
}

Alpine.magic("isCurrentPage", (el) => {
    return (subject) => fullUrl == getFullHref(subject || el);
});

Alpine.magic("isActivePage", (el) => {
    return (subject) => fullUrl.startsWith(getFullHref(subject || el));
});

Alpine.magic("deepMerge", () => {
    return (subject) => merge(...subject);
});

Alpine.magic("rafInterval", (el, { cleanup }) => (callback, delay) => {
    const interval = rafInterval(callback, delay);
    cleanup(() => interval.clear());
    return interval;
});

Alpine.magic("rafTimeOut", (el, { cleanup }) => (callback, delay) => {
    const timeout = rafTimeOut(callback, delay);
    cleanup(() => timeout.clear());
    return timeout;
});

Alpine.magic("theme", (el) => {
    return () => el.closest("[data-theme]")?.dataset.theme || null;
});

const isMobileDevice = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
Alpine.magic("isMobile", () => isMobileDevice);
