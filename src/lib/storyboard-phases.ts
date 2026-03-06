export type ClipCharacterRef = string | { name?: string | null }

export type CharacterAppearance = {
    changeReason?: string | null
    descriptions?: string | null
    selectedIndex?: number | null
    description?: string | null
}

export type CharacterAsset = {
    name: string
    appearances?: CharacterAppearance[]
}

export type LocationAsset = {
    name: string
    images?: Array<{
        isSelected?: boolean
        description?: string | null
    }>
}

export type StoryboardPanel = Record<string, any> & {
    panel_number?: number
    description?: string
    location?: string
}

export type PhotographyRule = Record<string, any> & {
    panel_number?: number
}

export type ActingDirection = Record<string, any> & {
    panel_number?: number
}

function extractCharacterNames(clipCharacters: ClipCharacterRef[]): string[] {
    return clipCharacters.map(item => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && typeof item.name === 'string') return item.name
        return ''
    }).filter(Boolean)
}

function characterNameMatches(characterName: string, referenceName: string): boolean {
    const charLower = characterName.toLowerCase().trim()
    const refLower = referenceName.toLowerCase().trim()
    if (charLower === refLower) return true
    const charAliases = charLower.split('/').map(s => s.trim()).filter(Boolean)
    const refAliases = refLower.split('/').map(s => s.trim()).filter(Boolean)
    return refAliases.some(refAlias => charAliases.includes(refAlias))
}

export function getFilteredAppearanceList(characters: CharacterAsset[], clipCharacters: ClipCharacterRef[]): string {
    if (clipCharacters.length === 0) return 'None'
    const charNames = extractCharacterNames(clipCharacters)
    return characters
        .filter((c) => charNames.some(name => characterNameMatches(c.name, name)))
        .map((c) => {
            const appearances = c.appearances || []
            if (appearances.length === 0) return `${c.name}: ["Initial Appearance"]`
            const appearanceNames = appearances.map((app) => app.changeReason || 'Initial Appearance')
            return `${c.name}: [${appearanceNames.map((n: string) => `"${n}"`).join(', ')}]`
        }).join('\n') || 'None'
}

export function getFilteredFullDescription(characters: CharacterAsset[], clipCharacters: ClipCharacterRef[]): string {
    if (clipCharacters.length === 0) return 'None'
    const charNames = extractCharacterNames(clipCharacters)
    return characters
        .filter((c) => charNames.some(name => characterNameMatches(c.name, name)))
        .map((c) => {
            const appearances = c.appearances || []
            if (appearances.length === 0) return `[${c.name}] No appearance description`

            return appearances.map((app) => {
                const appearanceName = app.changeReason || 'Initial Appearance'
                let finalDesc = app.description || 'No description'
                return `[${c.name} - ${appearanceName}] ${finalDesc}`
            }).join('\n')
        }).join('\n') || 'None'
}

export function getFilteredLocationsDescription(locations: LocationAsset[], clipLocation: string | null): string {
    if (!clipLocation) return 'None'
    const location = locations.find((l) => l.name.toLowerCase() === clipLocation.toLowerCase())
    if (!location) return 'None'
    const selectedImage = location.images?.find((img) => img.isSelected) || location.images?.[0]
    return selectedImage?.description || 'No description'
}

export function formatClipId(clip: any): string {
    if (clip.start !== undefined && clip.start !== null) {
        return `${clip.start}-${clip.end}`
    }
    return clip.id?.substring(0, 8) || 'unknown'
}
