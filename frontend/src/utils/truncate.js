
const truncate = (address, start = 7, end=-5) => {
    return address.slice(0, start) + '...' + address.slice(end);
}

export default truncate