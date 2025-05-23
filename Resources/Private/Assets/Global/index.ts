import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";
import collapse from "@alpinejs/collapse";
import persist from "@alpinejs/persist";
import grow from "alpinejs-textarea-grow";
import clipboard from "@ryangjchandler/alpine-clipboard";
import anchor from "Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/Custom/Source/Anchor";
import dialog from "Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/UI/Source/Dialog";
import disclosure from "Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/UI/Source/Disclosure";
import fetch from "Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/Custom/Source/Fetch";
import counter from "Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/Custom/Source/Counter";
import tooltip from "Packages/Carbon/Carbon.Alpine/Resources/Private/Assets/Custom/Source/Tooltip";
import typewriter from "./TypeWriter";
import "Packages/Plugins/Garagist.Fontawesome.AlpineJS/Resources/Private/Main";
import "./Magics";
import "../../Fusion/Atom/ScrollIndicator";
import "../../Fusion/Block/Breadcrumb";
import "../../Fusion/Module/Share";
import "../../Fusion/Section/Header";
// TODO Refactor this with the anchor Plugin
// import "./Preview";

(window as any).Alpine = Alpine;

// @ts-ignore
Alpine.plugin([
    anchor,
    clipboard,
    collapse,
    counter,
    dialog,
    disclosure,
    fetch,
    focus,
    grow,
    intersect,
    persist,
    tooltip,
    typewriter,
]);

Alpine.data("height", (selector, baseValue = 0) => ({
    height: baseValue,
    init() {
        const elements = [...this.$root.querySelectorAll(selector)];
        this.height = elements.reduce((acc, cur) => acc + cur.offsetHeight, baseValue);
    },
}));

const languageSelector = (language: string) =>
    document.querySelector(`link[rel="alternate"][hreflang="${language.replace("_", "-")}"]`) as HTMLLinkElement | null;

Alpine.data("languageSelector", function (languages: Record<string, string>, current: string) {
    return {
        open: false,
        languages: [],
        theme: this.$theme,
        init() {
            const array = [];
            for (const key in languages) {
                array.push({
                    href: languageSelector(key)?.href,
                    label: languages[key],
                    key,
                    current: key === current,
                });
            }
            this.languages = array;
        },
        getLink(language: string) {
            return languageSelector(language)?.href;
        },
    };
});

export default Alpine;
