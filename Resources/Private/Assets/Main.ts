import Alpine from "./Global";
import lazySizes from "lazysizes";
import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/aspectratio/ls.aspectratio";
import "lazysizes/plugins/native-loading/ls.native-loading";
import "DistributionPackages/Litefyr.Distribution/Resources/Private/Fusion/Main";
import initLoader from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/Loader";
import eventListener from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventListener";
import eventDispatcher from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventDispatcher";

initLoader({
    callback: () => Alpine.start(),
});

document.addEventListener("Neos.NodeCreated", () => {
    initLoader();
});

eventListener(
    "fetch-has-content",
    () => {
        setTimeout(() => {
            eventDispatcher("neos-photoswipe:init");
        }, 5);
    },
    false,
);

eventListener(
    "loader:markup",
    ({ detail }: CustomEvent) => {
        const { markup, callback } = detail;
        if (markup) {
            // Loads additional components before rendering
            initLoader({ markup, callback });
        }
    },
    false,
);

// Make sure plausible is a function
// @ts-ignore
window.plausible = window.plausible || function () {};

window.addEventListener("prettyembed", ({ detail }: CustomEvent) => {
    window.plausible("Video", { props: detail });
});

window.addEventListener("neosphotoswipe", ({ detail }: CustomEvent) => {
    if (detail.type != "fetch") {
        return;
    }
    if (detail.action == "open") {
        window.plausible("pageview", { u: detail.url });
        return;
    }
    window.plausible("pageview");
});

lazySizes.cfg.nativeLoading = {
    disableListeners: {
        focus: true,
        mouseover: true,
        click: true,
        transitionend: true,
        animationend: true,
        scroll: true,
    },
};
