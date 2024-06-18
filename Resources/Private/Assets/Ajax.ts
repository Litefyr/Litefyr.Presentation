import ajax from "@imacrayon/alpine-ajax";

document.addEventListener("presentation:init", () => {
    Alpine.plugin(ajax);
});
