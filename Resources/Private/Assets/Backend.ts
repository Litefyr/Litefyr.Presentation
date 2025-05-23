import "DistributionPackages/Litefyr.Distribution/Resources/Private/Fusion/Backend";
import eventListener from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventListener";
import { defaultEvent } from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventDispatcher";
import setZIndex from "./Global/zIndex";

// Don't init presentation
const initEvents = "code,disturber,slider,iCal,mautic,zammad,countdown";

eventListener("alpine:init", () => {
    initEvents.split(",").forEach((type) => {
        defaultEvent(`${type}:init`);
    });
});

neosPlaceholderOverride();

if (document.documentElement.classList.contains("content-clip--reverse")) {
    setZindexOnClippedElements();
}

function neosPlaceholderOverride() {
    const observerCallback = (mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type !== "attributes") {
                return;
            }
            const target = mutation.target;
            const placeholderTarget = target.querySelector("[data-placeholder]");

            if (!placeholderTarget) {
                return;
            }

            const override = target.getAttribute("data-neos-placeholder-override");
            const original = placeholderTarget.getAttribute("data-placeholder");

            if (!original || !override || original === override) {
                return;
            }

            console.log(`Override placeholder '${original}' with '${override}'`);
            placeholderTarget.setAttribute("data-placeholder", override);
        }
    };

    const observer = new MutationObserver(observerCallback);

    const config = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["data-neos-placeholder-override"],
    };

    observer.observe(document.body, config);
}

function setZindexOnClippedElements() {
    const observerCallback = (mutationList) => {
        for (const mutation of mutationList) {
            const { type, addedNodes } = mutation;
            if (type == "childList" && addedNodes.length) {
                setZIndex();
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    const config = { childList: true };
    const nodes = [...document.querySelectorAll(".neos-contentcollection")];
    nodes.forEach((node) => observer.observe(node, config));
}
