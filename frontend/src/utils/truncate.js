
const truncate = (address) => {
    return address.slice(0, 7) + '...' + address.slice(-5)
}

export default truncate