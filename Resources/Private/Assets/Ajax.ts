import ajax from "@imacrayon/alpine-ajax";

window.addEventListener("presentation:init", () => {
    Alpine.plugin(ajax);
});
