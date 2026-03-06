/**
 * Xử lý chuỗi giới thiệu nhân vật (dùng cho AI prompt)
 */
export function buildCharactersIntroduction(characters: Array<{ name: string; introduction?: string | null }>): string {
    if (!characters || characters.length === 0) return 'Tạm không có giới thiệu nhân vật'

    const introductions = characters
        .filter(c => c.introduction && c.introduction.trim())
        .map(c => `- ${c.name}: ${c.introduction}`)

    if (introductions.length === 0) return 'Tạm không có giới thiệu nhân vật'

    return introductions.join('\n')
}
