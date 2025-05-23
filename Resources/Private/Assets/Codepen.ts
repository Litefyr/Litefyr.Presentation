import initLoader from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/Loader";

const observer = new MutationObserver(() => {
    initLoader();
});

observer.observe(document.body, {
    subtree: true,
    childList: true,
});
