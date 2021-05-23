export const setFilename = (popularName, index = null) => {
    if (index === null) {
        return popularName.split(" ").shift()
    } else {
        return popularName.split(" ").shift() + "_" + index
    }
}