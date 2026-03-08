const API_BASE = "https://valorant-api.com/v1"

export interface Agent {
  uuid: string
  displayName: string
  description: string
  developerName: string
  displayIcon: string
  displayIconSmall: string
  bustPortrait: string
  fullPortrait: string
  fullPortraitV2: string
  killfeedPortrait: string
  background: string
  backgroundGradientColors: string[]
  assetPath: string
  isFullPortraitRightFacing: boolean
  isPlayableCharacter: boolean
  isAvailableForTest: boolean
  isBaseContent: boolean
  role: {
    uuid: string
    displayName: string
    description: string
    displayIcon: string
    assetPath: string
  } | null
  abilities: {
    slot: string
    displayName: string
    description: string
    displayIcon: string
  }[]
  voiceLine: {
    minDuration: number
    maxDuration: number
    mediaList: {
      id: number
      wwise: string
      wave: string
    }[]
  } | null
}

export interface Weapon {
  uuid: string
  displayName: string
  category: string
  defaultSkinUuid: string
  displayIcon: string
  killStreamIcon: string
  assetPath: string
  weaponStats: {
    fireRate: number
    magazineSize: number
    runSpeedMultiplier: number
    equipTimeSeconds: number
    reloadTimeSeconds: number
    firstBulletAccuracy: number
    shotgunPelletCount: number
    wallPenetration: string
    feature: string | null
    fireMode: string | null
    altFireType: string | null
    adsStats: {
      zoomMultiplier: number
      fireRate: number
      runSpeedMultiplier: number
      burstCount: number
      firstBulletAccuracy: number
    } | null
    altShotgunStats: {
      shotgunPelletCount: number
      burstRate: number
    } | null
    airBurstStats: {
      shotgunPelletCount: number
      burstDistance: number
    } | null
    damageRanges: {
      rangeStartMeters: number
      rangeEndMeters: number
      headDamage: number
      bodyDamage: number
      legDamage: number
    }[]
  } | null
  shopData: {
    cost: number
    category: string
    categoryText: string
    gridPosition: {
      row: number
      column: number
    } | null
    canBeTrashed: boolean
    image: string | null
    newImage: string
    newImage2: string | null
    assetPath: string
  } | null
  skins: WeaponSkin[]
}

export interface WeaponSkin {
  uuid: string
  displayName: string
  themeUuid: string
  contentTierUuid: string | null
  displayIcon: string | null
  wallpaper: string | null
  assetPath: string
  chromas: {
    uuid: string
    displayName: string
    displayIcon: string | null
    fullRender: string
    swatch: string | null
    streamedVideo: string | null
    assetPath: string
  }[]
  levels: {
    uuid: string
    displayName: string
    levelItem: string | null
    displayIcon: string | null
    streamedVideo: string | null
    assetPath: string
  }[]
}

export interface ValorantMap {
  uuid: string
  displayName: string
  narrativeDescription: string | null
  tacticalDescription: string | null
  coordinates: string | null
  displayIcon: string | null
  listViewIcon: string
  listViewIconTall: string | null
  splash: string
  stylizedBackgroundImage: string | null
  premierBackgroundImage: string | null
  assetPath: string
  mapUrl: string
  xMultiplier: number
  yMultiplier: number
  xScalarToAdd: number
  yScalarToAdd: number
  callouts: {
    regionName: string
    superRegionName: string
    location: {
      x: number
      y: number
    }
  }[] | null
}

export interface Buddy {
  uuid: string
  displayName: string
  isHiddenIfNotOwned: boolean
  themeUuid: string | null
  displayIcon: string
  assetPath: string
  levels: {
    uuid: string
    charmLevel: number
    hideIfNotOwned: boolean
    displayName: string
    displayIcon: string
    assetPath: string
  }[]
}

export interface PlayerCard {
  uuid: string
  displayName: string
  isHiddenIfNotOwned: boolean
  themeUuid: string | null
  displayIcon: string
  smallArt: string
  wideArt: string
  largeArt: string
  assetPath: string
}

export interface GameMode {
  uuid: string
  displayName: string
  duration: string | null
  economyType: string | null
  allowsMatchTimeouts: boolean
  isTeamVoiceAllowed: boolean
  isMinimapHidden: boolean
  orbCount: number
  roundsPerHalf: number
  teamRoles: string[] | null
  gameFeatureOverrides: {
    featureName: string
    state: boolean
  }[] | null
  gameRuleBoolOverrides: {
    ruleName: string
    state: boolean
  }[] | null
  displayIcon: string | null
  listViewIconTall: string | null
  assetPath: string
}

export interface ContentTier {
  uuid: string
  displayName: string
  devName: string
  rank: number
  juiceValue: number
  juiceCost: number
  highlightColor: string
  displayIcon: string
  assetPath: string
}

export interface Season {
  uuid: string
  displayName: string
  type: string | null
  startTime: string
  endTime: string
  parentUuid: string | null
  assetPath: string
}

export interface Spray {
  uuid: string
  displayName: string
  category: string | null
  themeUuid: string | null
  isNullSpray: boolean
  hideIfNotOwned: boolean
  displayIcon: string
  fullIcon: string | null
  fullTransparentIcon: string | null
  animationPng: string | null
  animationGif: string | null
  assetPath: string
  levels: {
    uuid: string
    sprayLevel: number
    displayName: string
    displayIcon: string | null
    assetPath: string
  }[]
}

// In-memory cache for instant subsequent requests
const memoryCache = new Map<string, { data: unknown; timestamp: number }>()
const MEMORY_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Large endpoints that exceed Next.js 2MB cache limit - use no-store
const LARGE_ENDPOINTS = ['/weapons', '/playercards', '/sprays', '/buddies']

async function fetchAPI<T>(endpoint: string, skipSkins = false): Promise<T> {
  const cacheKey = endpoint + (skipSkins ? '-noskins' : '')
  const cached = memoryCache.get(cacheKey)
  
  // Return from memory cache if fresh
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return cached.data as T
  }

  // Check if this is a large endpoint that shouldn't use Next.js cache
  const isLargeEndpoint = LARGE_ENDPOINTS.some(ep => endpoint.startsWith(ep))
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    // Use no-store for large endpoints to avoid cache size errors
    cache: isLargeEndpoint ? 'no-store' : 'force-cache',
    next: isLargeEndpoint ? undefined : { revalidate: 3600 }
  })
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  
  const data = await res.json()
  
  // Store in memory cache
  memoryCache.set(cacheKey, { data: data.data, timestamp: Date.now() })
  
  return data.data
}

export async function getAgents(): Promise<Agent[]> {
  const agents = await fetchAPI<Agent[]>("/agents?isPlayableCharacter=true")
  return agents
}

export async function getAgent(uuid: string): Promise<Agent> {
  return fetchAPI<Agent>(`/agents/${uuid}`)
}

export async function getWeapons(): Promise<Weapon[]> {
  return fetchAPI<Weapon[]>("/weapons")
}

export async function getWeapon(uuid: string): Promise<Weapon> {
  return fetchAPI<Weapon>(`/weapons/${uuid}`)
}

export async function getMaps(): Promise<ValorantMap[]> {
  return fetchAPI<ValorantMap[]>("/maps")
}

export async function getMap(uuid: string): Promise<ValorantMap> {
  return fetchAPI<ValorantMap>(`/maps/${uuid}`)
}

export async function getBuddies(): Promise<Buddy[]> {
  return fetchAPI<Buddy[]>("/buddies")
}

export async function getPlayerCards(): Promise<PlayerCard[]> {
  return fetchAPI<PlayerCard[]>("/playercards")
}

export async function getGameModes(): Promise<GameMode[]> {
  return fetchAPI<GameMode[]>("/gamemodes")
}

export async function getContentTiers(): Promise<ContentTier[]> {
  return fetchAPI<ContentTier[]>("/contenttiers")
}

export async function getSeasons(): Promise<Season[]> {
  return fetchAPI<Season[]>("/seasons")
}

export async function getSprays(): Promise<Spray[]> {
  return fetchAPI<Spray[]>("/sprays")
}
