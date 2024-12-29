export default function setZIndex() {
    const elements = [
        ...document.querySelectorAll(
            ":where(.-collection--top, .-collection--main, .-collection--bottom) > :where(.clippath-content, .clippath-quote)",
        ),
    ].reverse();
    elements.forEach((element, index) =>
        (element as HTMLElement).style.setProperty("--clippath-z-index", index.toString()),
    );
}
