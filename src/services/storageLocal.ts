export const storageLocal = {
    getItem: (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key)
        }
        return null
    },
    setItem: (key: string, value: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value)
        }
    },
    clear: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.clear()
        }
    }
}