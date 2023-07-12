export type Config = {
    directory?: string;
    /**
     * Update interval in milliseconds.
     */
    updateInterval?: number;
    stickers?: boolean;
    patches?: boolean;
    graffiti?: boolean;
    characters?: boolean;
    musicKits?: boolean;
    cases?: boolean;
    tools?: boolean;
    statusIcons?: boolean;
    logLevel?: 'error' | 'warn' | 'help' | 'data' | 'info' | 'debug' | 'prompt' | 'http' | 'verbose' | 'input' | 'silly';
}

export type Wear = 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'Battle-Scarred';

export type Phases = {
    ruby: PhaseValue;
    sapphire: PhaseValue;
    blackpearl: PhaseValue;
    emerald: PhaseValue;
    phase1: PhaseValue;
    phase2: PhaseValue;
    phase3: PhaseValue;
    phase4: PhaseValue;
}

export type Phase = 'phase1' | 'phase' | 'phase3' | 'phase4' | 'emerald' | 'blackpearl' | 'sapphire' | 'ruby';
export type PhaseValue = 'am_ruby_marbleized' | 'am_sapphire_marbleized' | 'am_blackpearl_marbleized' | 'am_emerald_marbleized' | 'phase1' | 'phase2' | 'phase3' | 'phase4';

export type Manifest = {
    files: ManifestFile[],
    depot_id: number,
    gid_manifest: string,
    creation_time: number,
    filenames_encrypted: boolean,
    cb_disk_original: string,
    cb_disk_compressed: string,
    unique_chunks: number,
    crc_encrypted: number,
    crc_clear: number
}

export type ManifestFile = {
    filename: string;
    sha_content: string;
    size: number;
    flags: any[];
    chunks: any[];
}

/**
 * Standard key-value object
 */
export type KVO<v> = {[k: string]: v}