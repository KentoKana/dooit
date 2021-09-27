export const isNullOrUndefined = (value: any) => {
    if (value !== null && value !== undefined) {
        return false
    }
    return true;
}