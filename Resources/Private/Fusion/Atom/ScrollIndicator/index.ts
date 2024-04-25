import Alpine from "alpinejs";

const html = document.documentElement;

Alpine.directive("scrollindicator", (el, { expression }, { evaluate, Alpine }) => {
    // @ts-ignore
    const { scroll, hide } = evaluate(expression);
    Alpine.bind(el, {
        "x-transition"() {},
        "x-data"() {
            return {
                show: true,
                height: 0,
                update() {
                    this.show = html.scrollTop < Math.round(this.height * hide);
                },
                init() {
                    this.height = window.innerHeight;
                    this.update();
                },
            };
        },
        "@click"() {
            window.scrollBy({
                top: Math.round(this.height * scroll),
                left: 0,
                behavior: "smooth",
            });
        },
        "@resize.window.debounce.passive"() {
            this.init();
        },
        "@scroll.window.debounce.passive"() {
            this.update();
        },
        "@scroll.window.throttle.passive"() {
            this.update();
        },
        "x-show"() {
            return this.show;
        },
    });
});
