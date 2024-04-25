import Alpine from "alpinejs";

const HTML = document.documentElement;

const headerKey = "header";

Alpine.data(headerKey, function (scrollAmount: number, classNameOnScroll: string, addScrollClassOnlyOnTop: boolean) {
    return {
        mobileMenuOpen: false,
        atTop: true,
        height: this.$persist(0).as(`${headerKey}-height`),
        offset: 0,
        currentHref: location.href,
        mobile: this.$persist(true).as(`${headerKey}-mobile`),
        width: this.$persist({
            nav: 0,
            list: 0,
            spacing: 0,
            header: "100%",
            logo: "100%",
        }).as(`${headerKey}-width`),
        setHeaderHeight() {
            this.height = this.$refs.header.offsetHeight;
        },
        calculateBreakpoint() {
            const header = this.$refs.header;
            // Calculate all the paddings, margins, borders and gaps
            // Include the switcher width to get the max width of the logo
            const container = this.$refs?.container || header;
            const switcher = this.$refs?.switcher;
            const switcherWidth = switcher?.offsetWidth || 0;
            let spacing = getSpacingValues(container, ["padding", "margin", "border", "gap"]);
            if (switcher) {
                spacing += switcherWidth;
                spacing += getSpacingValues(switcher, ["padding", "margin", "border"]);
            }

            // Calculate if mobile menu is needed
            const navElement = this.$refs.navMain;
            // We need to get the width of the wrapper without padding;
            const nav = (navElement?.clientWidth || 0) - getSpacingValues(navElement, ["padding"]);
            const list = this.$refs.navList?.offsetWidth || 0;

            const headerWidth = this.$el.offsetWidth;
            const width = {
                nav,
                list,
                spacing,
                header: headerWidth,
                logo: headerWidth - spacing,
            };

            this.mobile = list ? nav <= list : false;
            this.width = width;

            Object.entries(width).forEach(([key, value]) => {
                header.style.setProperty(`--${headerKey}-w-${key}`, `${value}px`);
            });
        },
        init() {
            this.$nextTick(() => {
                this.setHeaderHeight();
                this.calculateBreakpoint();
            });
        },
        onScroll() {
            const offset = window.scrollY;
            this.atTop = offset < scrollAmount || (addScrollClassOnlyOnTop ? false : this.offset > offset);
            this.offset = offset;
            if (!this.atTop) {
                this.mobileMenuOpen = false;
            }
            this.$dispatch("scrollposition", { offset, atTop: this.atTop });
        },
        header: {
            "x-effect"() {
                HTML.style.setProperty(`--${headerKey}-height`, `${this.height}px`);
            },
            "@resize.window.passive.debounce"() {
                this.mobileMenuOpen = false;
                this.init();
            },
            "@resize.window.passive.throttle"() {
                this.mobileMenuOpen = false;
                this.init();
            },
            "@scroll.window.passive.throttle"() {
                this.onScroll();
            },
            "@scroll.window.passive.debounce"() {
                this.onScroll();
            },
            ":class"() {
                return this.atTop || classNameOnScroll;
            },
            "@keydown.window.escape"() {
                this.mobileMenuOpen = false;
            },
            "x-trap.noscroll.inert"() {
                return this.mobileMenuOpen;
            },
            "@click.outside"() {
                this.mobileMenuOpen = false;
            },
        },
    };
});

// Calculate all the paddings, margins, borders and gaps
function getSpacingValues(element, properties = ["padding", "margin", "border", "gap"]) {
    if (!element || properties.length === 0) {
        return 0;
    }
    const computedStyle = window.getComputedStyle(element, null);

    let value = 0;
    if (properties.includes("padding")) {
        value += parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    }
    if (properties.includes("margin")) {
        value += parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight);
    }
    if (properties.includes("border")) {
        value += parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
    }

    if (!properties.includes("gap")) {
        return value;
    }

    const childrenCount = element.childElementCount;
    // There is no gap if there is only one child
    if (childrenCount < 2) {
        return value;
    }

    const gap = computedStyle.columnGap;
    if (gap.includes("px")) {
        value += parseFloat(gap) * (childrenCount - 1);
    }
    return value;
}
