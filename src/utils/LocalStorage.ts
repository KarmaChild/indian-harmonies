export const addDateToLocalStorage = (date:string) => {
    localStorage.setItem(date, 'done')
}

export const dateIsDone = (date:string): boolean => {
    return localStorage.getItem(date) !== null
}
