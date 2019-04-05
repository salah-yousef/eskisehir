export function SerializerObj(obj) {
    const result = [];
    // tslint:disable-next-line:forin
    for (const property in obj) {
        result.push(encodeURIComponent(property) + '=' + encodeURIComponent(obj[property]));
    }
    return result.join('&');
}

