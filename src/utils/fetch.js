const get = (url, id) => {
    return fetch(url).then(res => res.json())
}
const post = (url, data) => {
    if (typeof data === 'object') {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
    else if(typeof data === 'string'){}
}

console.log();
