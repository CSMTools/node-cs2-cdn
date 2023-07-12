/// <reference types="node" />
import EventEmitter from 'events';
import { VPK } from 'vpk2';
import { Logger } from 'winston';
import SteamUser from 'steam-user';
import { Config, Wear, Phases, ManifestFile, KVO, PhaseValue, Phase } from './types';
export { Config, Wear, Phases, ManifestFile, KVO, PhaseValue, Phase };
declare interface CSCdn {
    on(event: 'ready', listener: () => void): this;
    on(event: string, listener: Function): this;
}
declare class CSCdn extends EventEmitter {
    #private;
    user: SteamUser;
    log: Logger;
    vpkDir?: VPK;
    itemsGame: any;
    csEnglish: any;
    itemsGameCDN: any;
    weaponNameMap: string[];
    csEnglishKeys: string[];
    get ready(): boolean;
    get steamReady(): boolean;
    static phase: Phases;
    set ready(r: boolean);
    constructor(steamUser: SteamUser, config?: Config);
    /**
     * Retrieves and updates the sticker file directory from Valve
     *
     * Ensures that only the required VPK files are downloaded and that files with the same SHA1 aren't
     * redownloaded
     *
     * @return {Promise<void>}
     */
    update(): Promise<void>;
    /**
     * Given a VPK path, returns the CDN URL
     * @param path VPK path
     * @return {string|void} CDN URL
     */
    getPathURL(path: string): string | void;
    /**
     * Returns the item Steam CDN URL for the specified name
     *
     * Example Sticker Names: cologne2016/nv, cologne2016/fntc_holo, cologne2016/fntc_foil, cluj2015/sig_olofmeister_gold
     *
     * You can find the sticker names from their relevant "sticker_material" fields in items_game.txt
     *      items_game.txt can be found in the core game files of CS:GO or as itemsGame here
     *
     * @param name The item name (the sticker_material field in items_game.txt, or the cdn file format)
     * @param large Whether to obtain the "large" CDN version of the item
     * @return {string|void} If successful, the HTTPS CDN URL for the item
     */
    getStickerURL(name: string, large?: boolean): string | void;
    /**
     * Returns the item Steam CDN URL for the specified name
     *
     * Example Patch Names: case01/patch_phoenix, case01/patch_dangerzone, case01/patch_easypeasy, case_skillgroups/patch_goldnova1
     *
     * You can find the patch names from their relevant "patch_material" fields in items_game.txt
     *      items_game.txt can be found in the core game files of CS:GO or as itemsGame here
     *
     * @param name The item name (the patch_material field in items_game.txt, or the cdn file format)
     * @param large Whether to obtain the "large" CDN version of the item
     * @return {string|void} If successful, the HTTPS CDN URL for the item
     */
    getPatchURL(name: string, large?: boolean): string | void;
    /**
     * Given the specified defindex and paintindex, returns the CDN URL
     *
     * The item properties can be found in items_game.txt
     *
     * @param defindex Item Definition Index (weapon type)
     * @param paintindex Item Paint Index (skin type)
     * @return {string|void} Weapon CDN URL
     */
    getWeaponURL(defindex: string, paintindex: string): string | void;
    /**
     * Returns whether the given name is a weapon by checking
     * the prefab and whether it is used by one of the sides
     * @param marketHashName Item name
     * @return {boolean} Whether a weapon
     */
    isWeapon(marketHashName: string): boolean;
    /**
     * Returns the sticker URL given the market hash name
     * @param marketHashName Sticker name
     * @return {string|void} Sticker image URL
     */
    getStickerNameURL(marketHashName: string): string | void;
    /**
     * Returns the patch URL given the market hash name
     * @param marketHashName Patch name
     * @return {string|void} Patch image URL
     */
    getPatchNameURL(marketHashName: string): string | void;
    /**
     * Returns the graffiti URL given the market hash name
     * @param marketHashName Graffiti name (optional tint)
     * @param large Whether to obtain the "large" CDN version of the item
     * @return {string|void} CDN Image URL
     */
    getGraffitiNameURL(marketHashName: string, large?: boolean): string | void;
    /**
     * Returns the weapon URL given the market hash name
     * @param marketHashName Weapon name
     * @param {Phase?} phase Optional Doppler Phase from the phase enum
     * @return {string|void} Weapon image URL
     */
    getWeaponNameURL(marketHashName: string, phase?: PhaseValue): string | void;
    /**
     * Returns the music kit URL given the market hash name
     * @param marketHashName Music kit name
     * @return {string|void} Music kit image URL
     */
    getMusicKitNameURL(marketHashName: string): string | void;
    /**
     * Retrieves the given item CDN URL given its market_hash_name
     *
     * Examples: M4A4 | 龍王 (Dragon King) (Field-Tested), Sticker | Robo, AWP | Redline (Field-Tested)
     *
     * Note: For a weapon, the name MUST have the associated wear
     *
     * @param marketHashName Item name
     * @param {Phase?} phase Optional Doppler Phase from the phase enum
     */
    getItemNameURL(marketHashName: string, phase?: PhaseValue): string | void;
}
export default CSCdn;
