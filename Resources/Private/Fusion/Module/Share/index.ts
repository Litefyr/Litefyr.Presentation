import Alpine from "alpinejs";

const navigator = window.navigator;

Alpine.data("share", () => ({
    url: "",
    encodedUrl: "",
    native: false,
    hasEventListener: false,
    open: false,
    init() {
        const url = window.location.href;
        this.url = url;
        this.encodedUrl = encodeURIComponent(this.url);
        this.native = typeof navigator?.canShare == "function" && navigator.canShare({ url });

        if (!this.hasEventListener) {
            this.hasEventListener = true;
            window.addEventListener("ajax:init", () => {
                this.$nextTick(() => {
                    this.init();
                });
            });
        }
    },
}));
