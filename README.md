# node-cs2-cdn

*Based on [csgo-cdn](https://www.npmjs.com/package/csgo-cdn) by [Stepan Fedorko-Bartos](http://stepan.me)*

Retrieves the Steam CDN URLs for CS:GO Item Images from their `market_hash_name` or properties.

Can retrieve CDN images for:
* Stickers
* Characters
* Graffiti (without tint)
* Weapons (and doppler phases)
* Music Kits
* Tools (Crate Keys, Cases, Stattrak Swap Tool, etc...)
* Status Icons (Pins, ESports Trophies, Map Contribution Tokens, Service Medals, etc...)


## Table of Contents
  * [Why?](#why)
  * [Why create a fork of the original project?](#why-create-a-fork-of-the-original-project)
  * [How?](#how)
  * [How to Install](#-how-to-install)
    * [See example.js](#-see-examplejs)
  * [Methods](#methods)
    * [Constructor(client, options)](#constructorclient-options)
    * [update()](#update)
    * [getPathURL(path)](#getpathurlpath)
    * [getStickerURL(name, large=true)](#getstickerurlname-largetrue)
    * [getStickerNameURL(marketHashName)](#getstickernameurlmarkethashname)
    * [getPatchURL(name, large=true)](#getpatchurlname-largetrue)
    * [getPatchNameURL(marketHashName)](#getpatchnameurlmarkethashname)
    * [getWeaponURL(defindex, paintindex)](#getweaponurldefindex-paintindex)
    * [getWeaponNameURL(marketHashName, phase?)](#getweaponnameurlmarkethashname-phase)
    * [isWeapon(marketHashName)](#isweaponmarkethashname)
    * [getGraffitiNameURL(marketHashName, large=true)](#getgraffitinameurlmarkethashname-largetrue)
    * [getMusicKitNameURL(marketHashName)](#getmusickitnameurlmarkethashname)
    * [getItemNameURL(marketHashName, phase)](#getitemnameurlmarkethashname-phase)
  * [Properties](#-properties)
    * [itemsGame](#itemsgame)
    * [csEnglish](#csenglish)
    * [itemsGameCDN](#itemsgamecdn)
    * [phase](#phase)
  * [Events](#-events)
    * [ready](#ready)
    

## Why?

Steam hosts all of the CS:GO resource images on their CDN, but unfortunately finding the URL for them was
difficult in the past and would require scraping the market or inventories.

This library allows you to retrieve the needed CDN URLs given the sticker name, which can save you lots in bandwidth
and prevents you from having to scrape it or host it yourself.

## Why create a fork of the original project?

I am super appreciative of what Stepan has created, but he has since stopped being active in the project, which is understandable. The original project stopped working due to a change in `steam-user`, and I've found that there are quite a few issues I'd like to fix with this fork, and I can't wait for him to start being active.

Having this library being actively developed might become quite relevant soon, as of the time of writing, counter-strike 2 is soon coming out, and is surely going to bring changes.

## How?

Most of the graphical resources for CSGO/CS2 are stored in [VPK](https://developer.valvesoftware.com/wiki/VPK_File_Format) files which include the sticker, music kit, tools, and status icon images.

The root of a VPK contains a `dir` file (`pak01_dir.vpk`) that specifies where files are located over multiple packages. If you look in the install directory of CS:GO, you'll see `pak01_003.vpk`, `pak01_004.vpk`, etc... where these files are located.

Thankfully, Valve was kind enough (as of writing this) to include all of the relevant images in roughly a score of packages which are only between 100-200MB each.

This library, using [node-steam-user](https://www.npmjs.com/package/steam-user), checks the manifest for any updates to the public branch of CS:GO, and if so, downloads only the required VPK packages that contain all relevant images if they have changed from the content servers.

When trying to retrieve a CDN image URL for a given item, the library takes the SHA1 hash of the file and the VPK path that links to it to generate the corresponding URL.

Example URL: https://steamcdn-a.akamaihd.net/apps/730/icons/econ/stickers/cologne2015/mousesports.3e75da497d9f75fa56f463c22db25f29992561ce.png

## 🚀 How to Install

### `npm install cs2-cdn`
or
### `yarn add cs2-cdn`

#### 🛠 See example.js
```javascript
const SteamUser = require('steam-user');
const csCDN = require('cs2-cdn');

const user = new SteamUser();
const cdn = new csCDN(user, { logLevel: 'debug' });

cdn.on('ready', () => {
   console.log(cdn.getItemNameURL('M4A4 | 龍王 (Dragon King) (Field-Tested)'));
   console.log(cdn.getItemNameURL('★ Karambit | Gamma Doppler (Factory New)', cdn.phase.emerald));
});
```

## Methods

### Constructor(client, options)

* `client` - [node-steam-user](https://github.com/DoctorMcKay/node-steam-user) Client **The account MUST own CS:GO**
* `options` - Options
    ```javascript
    {
        directory: 'data', // relative data directory for VPK files
        updateInterval: 32400000, // miliseconds between update checks, -1 to disable auto-updates
        logLevel: 'info', // logging level, (error, warn, info, verbose, debug, silly)
        stickers: true, // whether to obtain the vpk for stickers
        patches: true, // whether to obtain the vpk for patches
        graffiti: true, // whether to obtain the vpk for graffiti
        musicKits: true, // whether to obtain the vpk for music kits
        cases: true, // whether to obtain the vpk for cases
        tools: true, // whether to obtain the vpk for tools
        statusIcons: true, // whether to obtain the vpk for status icons
    }
    ```
    
### update()
Retrieves and updates the sticker file directory from Valve.
  
Ensures that only the required VPK files are downloaded and that files with the same SHA1 aren't
redownloaded.

### getPathURL(path)
* `path` - VPK path

Given a VPK path, returns the CDN URL.
  
### getStickerURL(name, large=true)

* `name` - Name of the sticker path from `items_game.txt`
* `large` - Whether to obtain the large version of the image

Returns the item Steam CDN URL for the specified name.

Example Sticker Names: `cologne2016/nv`, `cologne2016/fntc_holo`, `cologne2016/fntc_foil`, `cluj2015/sig_olofmeister_gold`.

You can find the sticker names from their relevant `sticker_material` fields in items_game.txt. items_game.txt can be found in the core game files of CS:GO or as `itemsGame` on the CDN class.
  
### getStickerNameURL(marketHashName)
* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")
  
Returns the sticker URL given the market hash name.
  
### getPatchURL(name, large=true)

* `name` - Name of the patch path from `items_game.txt`
* `large` - Whether to obtain the large version of the image

Returns the item Steam CDN URL for the specified name.

Example Sticker Names: `case01/patch_phoenix`, `case01/patch_dangerzone`, `case01/patch_easypeasy`, `case_skillgroups/patch_goldnova1`.

You can find the sticker names from their relevant `patch_material` fields in items_game.txt. items_game.txt can be found in the core game files of CS:GO or as `itemsGame` on the CDN class.
  
### getPatchNameURL(marketHashName)
* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")

Returns the patch URL given the market hash name.
  
### getWeaponURL(defindex, paintindex)

* `defindex` - Definition index of the item (ex. 7 for AK-47)
* `paintindex` - Paint index of the item (ex. 490 for Frontside Misty)
  
Given the specified defindex and paintindex, returns the CDN URL.
  
### getWeaponNameURL(marketHashName, phase?)
* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")
* `phase` - Optional weapon phase for doppler skins from the `phase` enum property
  
Returns the weapon URL given the market hash name.
  
### isWeapon(marketHashName)
* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")

Returns whether the given name is a weapon by checking the prefab and whether it is used by one of the sides (CT/T).

### getGraffitiNameURL(marketHashName, large=true)
* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")
* `large` - Whether to obtain the large version of the image
  
Returns the graffiti URL given the market hash name.
  
### getMusicKitNameURL(marketHashName)
* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")
  
Returns the music kit URL given the market hash name.
  
### getItemNameURL(marketHashName, phase)

* `marketHashName` - The market hash name of an item (ex. "Sticker | Robo" or "AWP | Redline (Field-Tested)")
* `phase` - Optional weapon phase for doppler skins from the `phase` enum property

**Note: For a weapon, the name MUST have the associated wear**

Retrieves the given item CDN URL given its market_hash_name

Ensure that you have enabled the relevant VPK downloading for the item category by using the options in the constructor.

Returns the 'large' version of the image.
  
## 🧾 Properties

### itemsGame

Parsed items_game.txt file as a dictionary.

### csEnglish

Parsed csgo_english file as a dictionary. Also contains all inverted keys, such that the values are also keys themselves for O(1) retrieval.

### itemsGameCDN

Parsed items_game_cdn.txt file as a dictionary

### phase

Doppler phase enum used to specify the phase of a knife or (soon) weapon.

```javascript
cdn.getItemNameURL('★ Karambit | Gamma Doppler (Factory New)', cdn.phase.emerald);
cdn.getItemNameURL('★ Huntsman Knife | Doppler (Factory New)', cdn.phase.blackpearl);
cdn.getItemNameURL('★ Huntsman Knife | Doppler (Factory New)', cdn.phase.phase1);
cdn.getItemNameURL('★ Flip Knife | Doppler (Minimal Wear)', cdn.phase.ruby);
cdn.getItemNameURL('★ Flip Knife | Doppler (Minimal Wear)', cdn.phase.sapphire);
```

## 🔊 Events

### ready

Emitted when cs2-cdn is ready, this must be emitted before using the object.