export const addDateToLocalStorage = (date: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(date, 'done')
    }
}

export const dateIsDone = (date: string): boolean => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(date) !== null
    }
    return false
}
