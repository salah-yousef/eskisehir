export function Serializer(obj: any) {
    const result = [];
    for (const property in obj) {
        if (property.hasOwnProperty(obj)) {
            result.push(encodeURIComponent(property) + '=' + encodeURIComponent(obj[property]));
        }
    }
    return result.join('&');
}
