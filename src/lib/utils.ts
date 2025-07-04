export function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function generateId(): string {
    return Math.random().toString(36).substr(2, 9)
}

export function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}
