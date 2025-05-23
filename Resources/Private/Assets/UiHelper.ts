function trimSlashes(str) {
    return str.replace(/ /g, "").split("/").filter(Boolean).join("/");
}

function nodePath(node, dropParts = 0, append = "") {
    if (!node) {
        return "";
    }
    append = trimSlashes(append);
    const path = node.contextPath.split("@")[0];
    if (append) {
        append = "/" + append;
    }
    if (!dropParts) {
        return path + append;
    }
    return path.split("/").slice(0, -dropParts).join("/") + append;
}

// @ts-ignore
window.Litefyr = {
    nodePath,
};
