/*

TODO Refactor this with the anchor Plugin

"Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/Custom/Source/Anchor";

import Alpine from "alpinejs";
import tippy, { followCursor } from "tippy.js";

Alpine.directive("preview", (el, { expression }) => {
    // @ts-ignore
    tippy(el, {
        placement: "top",
        content: "Lade…",
        delay: [2000, 0],
        allowHTML: true,
        maxWidth: 1600,
        followCursor: true,
        plugins: [followCursor],
        onShow(instance) {
            fetch(expression)
                .then((response) => response.text())
                .then((html) => {
                    instance.setContent(html);
                });
        },
    });
});

*/
