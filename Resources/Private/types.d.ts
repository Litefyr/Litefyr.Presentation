import { Alpine as AlpineType } from "alpinejs";

declare global {
    let MauticSDK: any;
    let Alpine: AlpineType;
    let neosPhotoSwipe: any;
    function darkMode(): boolean;
    function setMode(mode: string): string;
    function plausible(
        name: string,
        options?: {
            callback?: () => void;
            props?: { [key: string]: string };
            u?: string;
        },
    ): void;
}

export {};
