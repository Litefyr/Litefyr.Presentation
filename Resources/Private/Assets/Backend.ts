import "DistributionPackages/Litefyr.Distribution/Resources/Private/Fusion/Backend";
import eventListener from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventListener";
import { defaultEvent } from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventDispatcher";

// Don't init presentation
const initEvents = "disturber,slider,iCal,mautic,zammad";

eventListener("alpine:init", () => {
    initEvents.split(",").forEach((type) => {
        defaultEvent(`${type}:init`);
    });
});

function observerCallback(mutationList) {
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
}

const observer = new MutationObserver(observerCallback);

const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["data-neos-placeholder-override"],
};

observer.observe(document.body, config);
