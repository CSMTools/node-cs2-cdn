"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CSCdn_instances, _CSCdn_ready, _CSCdn_config, _CSCdn_vpkStickerFiles, _CSCdn_vpkPatchFiles, _CSCdn_createDataDirectory, _CSCdn_updateLoop, _CSCdn_getProductInfo, _CSCdn_getLatestManifestId, _CSCdn_loadResources, _CSCdn_invertDictionary, _CSCdn_parseItemsCDN, _CSCdn_downloadFiles, _CSCdn_loadVPK, _CSCdn_getRequiredVPKFiles, _CSCdn_downloadVPKFiles, _CSCdn_isFileDownloaded;
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const fs_1 = __importDefault(require("fs"));
const vpk2_1 = require("vpk2");
const vdf = __importStar(require("simple-vdf3"));
const hasha_1 = __importDefault(require("hasha"));
const winston_1 = __importDefault(require("winston"));
const CSGO_APP_ID = 730;
const CSGO_DEPOT_ID = 731;
const defaultConfig = {
    directory: 'data',
    updateInterval: 32400000,
    stickers: true,
    patches: true,
    graffiti: true,
    characters: true,
    musicKits: true,
    cases: true,
    tools: true,
    statusIcons: true,
    logLevel: 'info'
};
const wears = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
const neededDirectories = {
    stickers: 'resource/flash/econ/stickers',
    patches: 'resource/flash/econ/patches',
    graffiti: 'resource/flash/econ/stickers/default',
    characters: 'resource/flash/econ/characters',
    musicKits: 'resource/flash/econ/music_kits',
    cases: 'resource/flash/econ/weapon_cases',
    tools: 'resource/flash/econ/tools',
    statusIcons: 'resource/flash/econ/status_icons',
};
function bytesToMB(bytes) {
    return (bytes / 1000000).toFixed(2);
}
class CSCdn extends events_1.default {
    get ready() {
        return __classPrivateFieldGet(this, _CSCdn_ready, "f");
    }
    get steamReady() {
        return !!this.user.steamID;
    }
    set ready(r) {
        const old = this.ready;
        __classPrivateFieldSet(this, _CSCdn_ready, r, "f");
        if (r !== old && r) {
            this.log.debug('Ready');
            this.emit('ready');
        }
    }
    constructor(steamUser, config = {}) {
        super();
        _CSCdn_instances.add(this);
        _CSCdn_ready.set(this, false);
        _CSCdn_config.set(this, void 0);
        this.weaponNameMap = [];
        this.csEnglishKeys = [];
        _CSCdn_vpkStickerFiles.set(this, []);
        _CSCdn_vpkPatchFiles.set(this, []);
        __classPrivateFieldSet(this, _CSCdn_config, Object.assign(defaultConfig, config), "f");
        this.user = steamUser;
        __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_createDataDirectory).call(this);
        this.log = winston_1.default.createLogger({
            level: config.logLevel,
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.printf((info) => {
                        return `[cs2-cdn] ${info.level}: ${info.message}`;
                    })
                })
            ]
        });
        if (!this.steamReady) {
            this.log.debug('Steam not ready, waiting for logon');
            this.user.once('loggedOn', () => {
                __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_updateLoop).call(this);
            });
        }
        else {
            __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_updateLoop).call(this);
        }
    }
    /**
     * Retrieves and updates the sticker file directory from Valve
     *
     * Ensures that only the required VPK files are downloaded and that files with the same SHA1 aren't
     * redownloaded
     *
     * @return {Promise<void>}
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.info('Checking for CS:GO file updates');
            if (!this.steamReady) {
                this.log.warn(`Steam not ready, can't check for updates`);
                return;
            }
            const manifestId = yield __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_getLatestManifestId).call(this);
            this.log.debug(`Obtained latest manifest ID: ${manifestId.gid}`);
            //@ts-ignore
            const { manifest } = yield this.user.getManifest(CSGO_APP_ID, CSGO_DEPOT_ID, manifestId.gid, 'public');
            const manifestFiles = manifest.files;
            const dirFile = manifest.files.find((file) => file.filename.endsWith("csgo\\pak01_dir.vpk"));
            const itemsGameFile = manifest.files.find((file) => file.filename.endsWith("items_game.txt"));
            const itemsGameCDNFile = manifest.files.find((file) => file.filename.endsWith("items_game_cdn.txt"));
            const csEnglishFile = manifest.files.find((file) => file.filename.endsWith("csgo_english.txt"));
            if (!dirFile || !itemsGameFile || !itemsGameCDNFile || !csEnglishFile) {
                this.log.error("Failed to get a required manifestfile");
                let manifest = "";
                if (!dirFile) {
                    manifest = "dirFile";
                }
                if (!itemsGameFile) {
                    manifest = "itemsGameFile";
                }
                if (!itemsGameCDNFile) {
                    manifest = "itemsGameCDNFile";
                }
                if (!csEnglishFile) {
                    manifest = "csEnglishFile";
                }
                this.log.debug(`This manifestFile and potentially more could not be retrieved: ${manifest}`);
                return;
            }
            this.log.debug(`Downloading required static files`);
            yield __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_downloadFiles).call(this, [dirFile, itemsGameFile, itemsGameCDNFile, csEnglishFile]);
            this.log.debug('Loading static file resources');
            __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_loadResources).call(this);
            __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_loadVPK).call(this);
            if (this.vpkDir) {
                yield __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_downloadVPKFiles).call(this, this.vpkDir, manifestFiles);
            }
            else {
                this.log.error("No VPK class available.");
            }
            this.ready = true;
        });
    }
    /**
     * Given a VPK path, returns the CDN URL
     * @param path VPK path
     * @return {string|void} CDN URL
     */
    getPathURL(path) {
        if (!this.vpkDir) {
            this.log.debug("VPK is not initialized.");
            return;
        }
        const file = this.vpkDir.getFile(path);
        if (!file) {
            this.log.error(`Failed to retrieve ${path} in VPK, do you have the package category enabled in options?`);
            return;
        }
        const sha1 = (0, hasha_1.default)(file, {
            'algorithm': 'sha1'
        });
        path = path.replace('resource/flash', 'icons');
        path = path.replace('.png', `.${sha1}.png`);
        return `https://steamcdn-a.akamaihd.net/apps/${CSGO_APP_ID}/${path}`;
    }
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
    getStickerURL(name, large = true) {
        if (!this.ready) {
            return;
        }
        const fileName = large ? `${name}_large.png` : `${name}.png`;
        const path = __classPrivateFieldGet(this, _CSCdn_vpkStickerFiles, "f").find((t) => t.endsWith(fileName));
        if (path) {
            return this.getPathURL(path);
        }
    }
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
    getPatchURL(name, large = true) {
        if (!this.ready) {
            return;
        }
        const fileName = large ? `${name}_large.png` : `${name}.png`;
        const path = __classPrivateFieldGet(this, _CSCdn_vpkPatchFiles, "f").find((t) => t.endsWith(fileName));
        if (path)
            return this.getPathURL(path);
    }
    /**
     * Given the specified defindex and paintindex, returns the CDN URL
     *
     * The item properties can be found in items_game.txt
     *
     * @param defindex Item Definition Index (weapon type)
     * @param paintindex Item Paint Index (skin type)
     * @return {string|void} Weapon CDN URL
     */
    getWeaponURL(defindex, paintindex) {
        if (!this.ready) {
            return;
        }
        const paintKits = this.itemsGame.paint_kits;
        // Get the skin name
        let skinName = '';
        if (paintindex in paintKits) {
            skinName = paintKits[paintindex].name;
            if (skinName === 'default') {
                skinName = '';
            }
        }
        // Get the weapon name
        let weaponName;
        const items = this.itemsGame.items;
        if (defindex in items) {
            weaponName = items[defindex].name;
        }
        // Get the image url
        const cdnName = `${weaponName}_${skinName}`;
        return this.itemsGameCDN[cdnName];
    }
    /**
     * Returns whether the given name is a weapon by checking
     * the prefab and whether it is used by one of the sides
     * @param marketHashName Item name
     * @return {boolean} Whether a weapon
     */
    isWeapon(marketHashName) {
        const prefabs = this.itemsGame.prefabs;
        const items = this.itemsGame.items;
        const weaponName = marketHashName.split('|')[0].trim();
        const weaponTags = this.csEnglish['inverted'][weaponName];
        if (!weaponTags)
            return false;
        // For every matching weapon tag...
        for (const t of weaponTags) {
            const weaponTag = `#${t}`;
            const prefab = Object.keys(prefabs).find((n) => {
                const fab = prefabs[n];
                return fab.item_name === weaponTag;
            });
            let fab;
            if (!prefab) {
                // special knives aren't in the prefab (karambits, etc...)
                const item = Object.keys(items).find((n) => {
                    const i = items[n];
                    return i.item_name === weaponTag;
                });
                if (!item) {
                    return false;
                }
                fab = items[item];
            }
            else {
                fab = prefabs[prefab];
            }
            if (fab && fab.used_by_classes) {
                const used = fab.used_by_classes;
                // Ensure that the item is used by one of the sides
                if (used['terrorists'] || used['counter-terrorists']) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns the sticker URL given the market hash name
     * @param marketHashName Sticker name
     * @return {string|void} Sticker image URL
     */
    getStickerNameURL(marketHashName) {
        const reg = /Sticker \| (.*)/;
        const match = marketHashName.match(reg);
        if (!match)
            return;
        const stickerName = match[1];
        for (const tag of this.csEnglish['inverted'][stickerName] || []) {
            const stickerTag = `#${tag}`;
            const stickerKits = this.itemsGame.sticker_kits;
            const kitIndex = Object.keys(stickerKits).find((n) => {
                const k = stickerKits[n];
                return k.item_name === stickerTag;
            });
            if (!kitIndex) {
                continue;
            }
            const kit = stickerKits[kitIndex];
            if (!kit || !kit.sticker_material)
                continue;
            const url = this.getStickerURL(stickerKits[kitIndex].sticker_material, true);
            if (url) {
                return url;
            }
        }
    }
    /**
     * Returns the patch URL given the market hash name
     * @param marketHashName Patch name
     * @return {string|void} Patch image URL
     */
    getPatchNameURL(marketHashName) {
        const reg = /Patch \| (.*)/;
        const match = marketHashName.match(reg);
        if (!match)
            return;
        const stickerName = match[1];
        for (const tag of this.csEnglish['inverted'][stickerName] || []) {
            const stickerTag = `#${tag}`;
            const stickerKits = this.itemsGame.sticker_kits; // Patches are in the sticker_kits as well
            const kitIndex = Object.keys(stickerKits).find((n) => {
                const k = stickerKits[n];
                return k.item_name === stickerTag;
            });
            if (!kitIndex) {
                continue;
            }
            const kit = stickerKits[kitIndex];
            if (!kit || !kit.patch_material)
                continue;
            const url = this.getPatchURL(stickerKits[kitIndex].patch_material, true);
            if (url)
                return url;
        }
    }
    /**
     * Returns the graffiti URL given the market hash name
     * @param marketHashName Graffiti name (optional tint)
     * @param large Whether to obtain the "large" CDN version of the item
     * @return {string|void} CDN Image URL
     */
    getGraffitiNameURL(marketHashName, large = true) {
        const reg = /Sealed Graffiti \| ([^(]*)/;
        const match = marketHashName.match(reg);
        if (!match) {
            return;
        }
        const graffitiName = match[1].trim();
        for (const tag of this.csEnglish['inverted'][graffitiName] || []) {
            const stickerTag = `#${tag}`;
            const stickerKits = this.itemsGame.sticker_kits;
            const kitIndices = Object.keys(stickerKits).filter((n) => {
                const k = stickerKits[n];
                return k.item_name === stickerTag;
            });
            // prefer kit indices with "graffiti" in the name
            kitIndices.sort((a, b) => {
                const index1 = !!stickerKits[a].name && stickerKits[a].name.indexOf('graffiti');
                const index2 = !!stickerKits[b].name && stickerKits[b].name.indexOf('graffiti');
                if (index1 === index2) {
                    return 0;
                }
                else if (index1 > -1) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
            for (const kitIndex of kitIndices) {
                const kit = stickerKits[kitIndex];
                if (!kit || !kit.sticker_material)
                    continue;
                const url = this.getStickerURL(kit.sticker_material, large);
                if (url) {
                    return url;
                }
            }
        }
    }
    /**
     * Returns the weapon URL given the market hash name
     * @param marketHashName Weapon name
     * @param {Phase?} phase Optional Doppler Phase from the phase enum
     * @return {string|void} Weapon image URL
     */
    getWeaponNameURL(marketHashName, phase) {
        const hasWear = wears.findIndex((n) => marketHashName.includes(n)) > -1;
        if (hasWear) {
            // remove it
            marketHashName = marketHashName.replace(/\([^)]*\)$/, '');
        }
        const match = marketHashName.split('|').map((m) => m.trim());
        const weaponName = match[0];
        const skinName = match[1];
        if (!weaponName)
            return;
        const weaponTags = this.csEnglish['inverted'][weaponName] || [];
        const prefabs = this.itemsGame.prefabs;
        const items = this.itemsGame.items;
        // For every matching weapon tag...
        for (const t of weaponTags) {
            const weaponTag = `#${t}`;
            const prefab = Object.keys(prefabs).find((n) => {
                const fab = prefabs[n];
                return fab.item_name === weaponTag;
            });
            let weaponClass;
            if (!prefab) {
                // special knives aren't in the prefab (karambits, etc...)
                const item = Object.keys(items).find((n) => {
                    const i = items[n];
                    return i.item_name === weaponTag;
                });
                if (!item) {
                    continue;
                }
                if (items[item]) {
                    weaponClass = items[item].name;
                }
            }
            else {
                const item = Object.keys(items).find((n) => {
                    const i = items[n];
                    return i.prefab === prefab;
                });
                if (!item) {
                    continue;
                }
                if (items[item]) {
                    weaponClass = items[item].name;
                }
            }
            if (!weaponClass) {
                continue;
            }
            // Check if this is a vanilla weapon
            if (!skinName) {
                if (weaponClass && this.itemsGameCDN[weaponClass]) {
                    return this.itemsGameCDN[weaponClass];
                }
                else {
                    continue;
                }
            }
            // Check if is widow knife and if so if the specified phase is special (the gems have the same index as regular dopplers, but the widow has it's own indexes for phase 1-4).
            const isSpecialWidow = weaponClass === "weapon_knife_widowmaker"
                && skinName === "Doppler"
                && phase !== "am_ruby_marbleized"
                && phase !== "am_sapphire_marbleized"
                && phase !== "am_blackpearl_marbleized";
            // Roughly same as isSpecialWidow, but for butterfly and push knives.
            const isSpecialB = (weaponClass === "weapon_knife_push" || weaponClass === "weapon_knife_butterfly")
                && skinName === "Doppler"
                && (phase === "phase2"
                    || phase === "am_sapphire_marbleized"
                    || phase === "am_blackpearl_marbleized");
            // For every matching skin name...
            for (const key of this.csEnglish['inverted'][skinName] || []) {
                const skinTag = `#${key}`;
                const paintKits = this.itemsGame.paint_kits;
                const paintindexes = Object.keys(paintKits).filter((n) => {
                    const kit = paintKits[n];
                    let isPhase;
                    if (weaponClass === "weapon_glock") {
                        isPhase = !phase || kit.name.endsWith(phase + "_glock");
                    }
                    else if (isSpecialWidow) {
                        isPhase = !phase || kit.name.endsWith(phase + "_widow");
                    }
                    else if (isSpecialB) {
                        isPhase = !phase || kit.name.endsWith(phase + "_b");
                    }
                    else {
                        isPhase = !phase || kit.name.endsWith(phase);
                    }
                    return isPhase && kit.description_tag === skinTag;
                });
                // For every matching paint index...
                for (const paintindex of paintindexes) {
                    const paintKit = paintKits[paintindex].name;
                    const path = (paintKit ? `${weaponClass}_${paintKit}` : weaponClass).toLowerCase();
                    if (this.itemsGameCDN[path]) {
                        return this.itemsGameCDN[path];
                    }
                }
            }
        }
    }
    /**
     * Returns the music kit URL given the market hash name
     * @param marketHashName Music kit name
     * @return {string|void} Music kit image URL
     */
    getMusicKitNameURL(marketHashName) {
        const reg = /Music Kit \| (.*)/;
        const match = marketHashName.match(reg);
        if (!match) {
            return;
        }
        const kitName = match[1];
        for (const t of this.csEnglish['inverted'][kitName] || []) {
            const tag = `#${t}`;
            const musicDefs = this.itemsGame.music_definitions;
            const kitIndex = Object.keys(musicDefs).find((n) => {
                const k = musicDefs[n];
                return k.loc_name === tag;
            });
            if (!kitIndex) {
                continue;
            }
            const kit = musicDefs[kitIndex];
            if (!kit || !kit.image_inventory)
                continue;
            const path = `resource/flash/${kit.image_inventory}.png`;
            const url = this.getPathURL(path);
            if (url) {
                return url;
            }
        }
    }
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
    getItemNameURL(marketHashName, phase) {
        marketHashName = marketHashName.trim();
        let strippedMarketHashName = marketHashName;
        // Weapons and Music Kits can have extra tags we need to ignore
        const extraTags = ['★ ', 'StatTrak™ ', 'Souvenir '];
        for (const tag of extraTags) {
            if (strippedMarketHashName.startsWith(tag)) {
                strippedMarketHashName = strippedMarketHashName.replace(tag, '');
            }
        }
        if (this.isWeapon(strippedMarketHashName)) {
            return this.getWeaponNameURL(strippedMarketHashName, phase);
        }
        else if (strippedMarketHashName.startsWith('Music Kit |')) {
            return this.getMusicKitNameURL(strippedMarketHashName);
        }
        else if (marketHashName.startsWith('Sticker |')) {
            return this.getStickerNameURL(marketHashName);
        }
        else if (marketHashName.startsWith('Sealed Graffiti |')) {
            return this.getGraffitiNameURL(marketHashName);
        }
        else if (marketHashName.startsWith('Patch |')) {
            return this.getPatchNameURL(marketHashName);
        }
        else {
            // Other in items
            for (const t of this.csEnglish['inverted'][marketHashName] || []) {
                const tag = `#${t.toLowerCase()}`;
                const items = this.itemsGame.items;
                const prefabs = this.itemsGame.prefabs;
                let item = Object.keys(items).find((n) => {
                    const i = items[n];
                    return i.item_name && i.item_name.toLowerCase() === tag;
                });
                if (!item) {
                    continue;
                }
                let path;
                if (!items[item] || !items[item].image_inventory) {
                    // search the prefabs (ex. CS:GO Case Key)
                    item = Object.keys(prefabs).find((n) => {
                        const i = prefabs[n];
                        return i.item_name && i.item_name.toLowerCase() === tag;
                    });
                    if (!item) {
                        continue;
                    }
                    if (!prefabs[item] || !prefabs[item].image_inventory)
                        continue;
                    path = `resource/flash/${prefabs[item].image_inventory}.png`;
                }
                else {
                    path = `resource/flash/${items[item].image_inventory}.png`;
                }
                const url = this.getPathURL(path);
                if (url) {
                    return url;
                }
            }
        }
    }
}
_CSCdn_ready = new WeakMap(), _CSCdn_config = new WeakMap(), _CSCdn_vpkStickerFiles = new WeakMap(), _CSCdn_vpkPatchFiles = new WeakMap(), _CSCdn_instances = new WeakSet(), _CSCdn_createDataDirectory = function _CSCdn_createDataDirectory() {
    const dir = `./${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}`;
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
}, _CSCdn_updateLoop = function _CSCdn_updateLoop() {
    if (__classPrivateFieldGet(this, _CSCdn_config, "f").updateInterval && __classPrivateFieldGet(this, _CSCdn_config, "f").updateInterval > 0) {
        return this.update().then(() => setInterval(() => {
            this.update();
        }, __classPrivateFieldGet(this, _CSCdn_config, "f").updateInterval));
    }
    else {
        this.log.info('Auto-updates disabled, checking if required files exist');
        // Try to load the resources locally
        try {
            __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_loadResources).call(this);
            __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_loadVPK).call(this);
            this.ready = true;
        }
        catch (e) {
            this.log.warn('Needed CS:GO files not installed');
            this.update();
        }
    }
}, _CSCdn_getProductInfo = function _CSCdn_getProductInfo() {
    this.log.debug('Obtaining CS:GO product info');
    return new Promise((resolve, reject) => {
        this.user.getProductInfo([CSGO_APP_ID], [], true, (err, apps, packages, unknownApps, unknownPackages) => {
            resolve([apps, packages, unknownApps, unknownPackages]);
        });
    });
}, _CSCdn_getLatestManifestId = function _CSCdn_getLatestManifestId() {
    this.log.debug('Obtaining latest manifest ID');
    return __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_getProductInfo).call(this).then(([apps, packages, unknownApps, unknownPackages]) => {
        const csgo = apps[(CSGO_APP_ID).toString()].appinfo;
        const commonDepot = csgo.depots[(CSGO_DEPOT_ID).toString()];
        return commonDepot.manifests.public;
    });
}, _CSCdn_loadResources = function _CSCdn_loadResources() {
    this.itemsGame = vdf.parse(fs_1.default.readFileSync(`${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}/items_game.txt`, 'utf8'))['items_game'];
    this.csEnglish = vdf.parse(fs_1.default.readFileSync(`${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}/csgo_english.txt`, 'ucs2'))['lang']['Tokens'];
    this.itemsGameCDN = __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_parseItemsCDN).call(this, fs_1.default.readFileSync(`${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}/items_game_cdn.txt`, 'utf8'));
    this.weaponNameMap = Object.keys(this.csEnglish).filter(n => n.startsWith("SFUI_WPNHUD"));
    this.csEnglishKeys = Object.keys(this.csEnglish);
    // Ensure paint kit descriptions are available in lowercase to resolve inconsistencies in the language and items_game file
    Object.keys(this.itemsGame.paint_kits).forEach((n) => {
        const kit = this.itemsGame.paint_kits[n];
        if ('description_tag' in kit) {
            // Check if english file and paintkit don't match, if they don't, make them the same.
            if (!(kit.description_tag.replace("#", "") in this.csEnglish)) {
                const endKey = kit.description_tag.replace("#", "").toLowerCase();
                const engKey = getKeyCaseInsensitive(this.csEnglish, kit.description_tag.replace("#", ""));
                if (engKey) {
                    this.csEnglish[endKey] = this.csEnglish[engKey];
                    this.csEnglishKeys.push(endKey);
                }
                kit.description_tag = "#" + endKey;
            }
        }
    });
    __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_invertDictionary).call(this, this.csEnglish);
}, _CSCdn_invertDictionary = function _CSCdn_invertDictionary(dict) {
    dict['inverted'] = {};
    for (const prop in dict) {
        if (prop === 'inverted' || !dict.hasOwnProperty(prop))
            continue;
        const val = dict[prop];
        if (typeof val === 'object' && !(val instanceof Array)) {
            __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_invertDictionary).call(this, val);
        }
        else {
            if (dict['inverted'][val] === undefined) {
                dict['inverted'][val] = [prop];
            }
            else {
                dict['inverted'][val].push(prop);
            }
        }
    }
}, _CSCdn_parseItemsCDN = function _CSCdn_parseItemsCDN(data) {
    let lines = data.split('\n');
    const items_game_cdn = {};
    for (let line of lines) {
        let kv = line.split('=');
        if (kv[1]) {
            items_game_cdn[kv[0]] = kv[1];
        }
    }
    return items_game_cdn;
}, _CSCdn_downloadFiles = function _CSCdn_downloadFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (const file of files) {
            const nameArr = file.filename.split('\\');
            let name = nameArr[nameArr.length - 1];
            const path = `${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}/${name}`;
            const isDownloaded = yield __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_isFileDownloaded).call(this, path, file.sha_content);
            if (isDownloaded) {
                continue;
            }
            //@ts-ignore
            const promise = this.user.downloadFile(CSGO_APP_ID, CSGO_DEPOT_ID, file, `${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}/${name}`);
            promises.push(promise);
        }
        return Promise.all(promises);
    });
}, _CSCdn_loadVPK = function _CSCdn_loadVPK() {
    this.vpkDir = new vpk2_1.VPK(__classPrivateFieldGet(this, _CSCdn_config, "f").directory + '/pak01_dir.vpk');
    this.vpkDir.load();
    __classPrivateFieldSet(this, _CSCdn_vpkStickerFiles, this.vpkDir.files.filter((f) => f.startsWith('resource/flash/econ/stickers')), "f");
    __classPrivateFieldSet(this, _CSCdn_vpkPatchFiles, this.vpkDir.files.filter((f) => f.startsWith('resource/flash/econ/patches')), "f");
}, _CSCdn_getRequiredVPKFiles = function _CSCdn_getRequiredVPKFiles(vpkDir) {
    const requiredIndices = [];
    const neededDirs = Object.keys(neededDirectories).filter((f) => !!(__classPrivateFieldGet(this, _CSCdn_config, "f")[f])).map((f) => neededDirectories[f]);
    for (const fileName of vpkDir.files) {
        for (const dir of neededDirs) {
            if (fileName.startsWith(dir)) {
                const archiveIndex = vpkDir.tree[fileName].archiveIndex;
                if (!requiredIndices.includes(archiveIndex)) {
                    requiredIndices.push(archiveIndex);
                }
                break;
            }
        }
    }
    return requiredIndices.sort();
}, _CSCdn_downloadVPKFiles = function _CSCdn_downloadVPKFiles(vpkDir, manifestFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        this.log.debug('Computing required VPK files for selected packages');
        const requiredIndices = __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_getRequiredVPKFiles).call(this, vpkDir);
        this.log.debug(`Required VPK files ${requiredIndices}`);
        for (let indexStr in requiredIndices) {
            const index = parseInt(indexStr);
            // pad to 3 zeroes
            const archiveIndex = requiredIndices[index];
            const paddedIndex = '0'.repeat(3 - archiveIndex.toString().length) + archiveIndex;
            const fileName = `pak01_${paddedIndex}.vpk`;
            const file = manifestFiles.find((file) => file.filename.endsWith(fileName));
            if (!file) {
                this.log.error(`Couldn't find ${fileName} in manifest.`);
                continue;
            }
            const filePath = `${__classPrivateFieldGet(this, _CSCdn_config, "f").directory}/${fileName}`;
            const isDownloaded = yield __classPrivateFieldGet(this, _CSCdn_instances, "m", _CSCdn_isFileDownloaded).call(this, filePath, file.sha_content);
            if (isDownloaded) {
                this.log.info(`Already downloaded ${filePath}`);
                continue;
            }
            const status = `[${index + 1}/${requiredIndices.length}]`;
            this.log.info(`${status} Downloading ${fileName} - ${bytesToMB(file.size)} MB`);
            //@ts-ignore
            yield this.user.downloadFile(CSGO_APP_ID, CSGO_DEPOT_ID, file, filePath, (_none, details) => {
                const { type, bytesDownloaded, totalSizeBytes } = details;
                if (type === 'progress') {
                    this.log.info(`${status} ${(bytesDownloaded * 100 / totalSizeBytes).toFixed(2)}% - ${bytesToMB(bytesDownloaded)}/${bytesToMB(totalSizeBytes)} MB`);
                }
            });
            this.log.info(`${status} Downloaded ${fileName}`);
        }
    });
}, _CSCdn_isFileDownloaded = function _CSCdn_isFileDownloaded(path, sha1) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hash = yield hasha_1.default.fromFile(path, { algorithm: 'sha1' });
            return hash === sha1;
        }
        catch (e) {
            return false;
        }
    });
};
CSCdn.phase = {
    ruby: 'am_ruby_marbleized',
    sapphire: 'am_sapphire_marbleized',
    blackpearl: 'am_blackpearl_marbleized',
    emerald: 'am_emerald_marbleized',
    phase1: 'phase1',
    phase2: 'phase2',
    phase3: 'phase3',
    phase4: 'phase4'
};
/**
  * @param {Object} object
  * @param {string} key
  * @return {string | undefined} key
 */
function getKeyCaseInsensitive(object, key) {
    const asLowercase = key.toLowerCase();
    return Object.keys(object)
        .find((k) => k.toLowerCase() === asLowercase);
}
exports.default = CSCdn;
