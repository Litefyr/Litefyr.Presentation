import ajax from "@imacrayon/alpine-ajax";
import eventListener from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventListener";

eventListener("presentation:init", () => {
    Alpine.plugin(ajax);
});
