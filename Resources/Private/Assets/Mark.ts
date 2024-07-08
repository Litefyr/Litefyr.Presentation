import { annotate, annotationGroup } from "rough-notation";
import type { RoughAnnotation, RoughAnnotationType } from "rough-notation/lib/model";
import { rafTimeOut } from "./Global/requestAnimationFrame";
import eventListener from "Packages/Carbon/Carbon.FileLoader/Resources/Private/Assets/EventListener";

// This add a x-mark directive to AlpineJS
// <p x-mark>Text <mark>This gets highlighted</mark></p>
// <p x-mark:underline>Text <mark>This gets underlined</mark></p>
// <p x-mark:box="em">Text <em>This gets boxed</em></p>
// <p x-mark:circle>Text <mark>This gets circled</mark></p>
// <p x-mark:crossed-off>Text <mark>This gets crossed-off</mark></p>
// <p x-mark:underline="self">This gets underlined</p>
// <p x-mark:bracket.brackets.top.bottom.duration.2000ms.stroke.4="self">This gets brackets on top and bottom with the duration of 2s and a stroke of 4px</p>
// <p x-mark:strike-through.color.red.duration.4000>TText <mark>This is strike trough with the color red and the duration of 4s</mark></p>

const baseTime = 800;
const minmalTime = 300;
const types: RoughAnnotationType[] = [
    "underline",
    "box",
    "circle",
    "highlight",
    "strike-through",
    "crossed-off",
    "bracket",
];
const multiline = true;

eventListener("mark:init", () => {
    Alpine.directive("mark", (el, { value, expression, modifiers }) => {
        const selector = expression || "mark";
        // @ts-ignore
        const type: RoughAnnotationType = types.includes(value) ? value : "highlight";
        const defaultColor = "var(--color-accent-l) var(--color-accent-c) var(--color-accent-h)";
        const color = modifierValue(
            modifiers,
            "color",
            type == "highlight" ? `oklch(${defaultColor} / 0.4)` : `oklch(${defaultColor} / 0.8)`,
        );
        const brackets = modifierValue(modifiers, "brackets", ["left", "right"]);
        const strokeWidth = modifierValue(modifiers, "stroke", 2);
        const duration = modifierValue(modifiers, "duration", minmalTime);

        const items: RoughAnnotation[] = [];
        let index = 0;

        if (selector === "self") {
            items.push(
                // @ts-ignore
                annotate(el, {
                    type,
                    multiline,
                    brackets,
                    color,
                    strokeWidth,
                    animationDuration: Math.max(baseTime - index * 100, duration),
                }),
            );
            index++;
        } else {
            // @ts-ignore
            [...el.querySelectorAll(selector)].forEach((mark) => {
                items.push(
                    annotate(mark, {
                        type,
                        multiline,
                        brackets,
                        color,
                        strokeWidth,
                        animationDuration: Math.max(baseTime - index * 100, minmalTime),
                    }),
                );
                index++;
            });
        }

        const group = annotationGroup(items);

        rafTimeOut(() => {
            group.show();
        }, 1000);
    });
});

function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) {
        return fallback;
    }

    const getValue = (pointer = 1) => modifiers[modifiers.indexOf(key) + pointer];

    // If it IS present, grab the value after it
    const rawValue = getValue();

    const getMultipleValues = (possibleValues) => {
        const maxValues = possibleValues.length;
        const returnValue = [rawValue];
        for (let index = 2; index <= maxValues; index++) {
            const value = getValue(index);
            if (possibleValues.includes(value)) {
                returnValue.push(value);
            }
        }
        if (returnValue.length == 1) {
            return rawValue;
        }
        return returnValue;
    };

    if (!rawValue) {
        return fallback;
    }

    if (key === "stroke") {
        // Check if the very next value is NOT a number and return the fallback.
        // If x-mark.stroke, we'll use the default scale value.
        // That is how a user opts out of the opacity transition.
        if (isNaN(rawValue)) return fallback;
    }

    if (key === "duration") {
        // Support x-mark.duration.500ms && duration.500
        const match = rawValue.match(/([0-9]+)ms/);
        if (match) {
            return match[1];
        }
    }

    if (key === "brackets") {
        // Support chaining origin directions: x-mark.brackets.top.right.top.bottom
        return getMultipleValues(["top", "right", "bottom", "left"]);
    }

    return rawValue;
}
