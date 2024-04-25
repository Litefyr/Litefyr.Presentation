import Alpine from "alpinejs";
// eslint-disable-next-line no-empty-pattern
Alpine.directive("breadcrump", (el, {}, { Alpine }) => {
    Alpine.bind(el, {
        "x-data"() {
            return {
                home: {},
                items: [],
                init() {
                    const scriptTag = document.querySelector("#breadcrump-data");
                    const data = scriptTag ? JSON.parse(scriptTag.innerHTML) : false;
                    if (!data) {
                        return;
                    }
                    this.items = data.itemListElement.map((entry) => ({
                        label: entry.name,
                        href: entry.item,
                    }));
                    this.home = this.items.shift();
                },
            };
        },
        "@ajax:init.window"() {
            this.$nextTick(() => {
                this.init();
            });
        },
        "x-show"() {
            return !!this.items.length;
        },
    });
});
