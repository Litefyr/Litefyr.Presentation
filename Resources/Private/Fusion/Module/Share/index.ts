import Alpine from "alpinejs";
import eventListener from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventListener";

const navigator = window.navigator;

Alpine.data("share", () => ({
    url: "",
    encodedUrl: "",
    native: false,
    hasEventListener: false,
    open: false,
    theme: null,
    init() {
        const url = window.location.href;
        this.url = url;
        this.encodedUrl = encodeURIComponent(this.url);
        this.native = typeof navigator?.canShare == "function" && navigator.canShare({ url });
        this.theme = this.$theme;

        if (!this.hasEventListener) {
            this.hasEventListener = true;
            eventListener(
                "ajax:init",
                () => {
                    this.$nextTick(() => {
                        this.init();
                    });
                },
                false,
            );
        }
    },
}));
