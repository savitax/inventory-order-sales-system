const { getType } = require('./utils')
const get = (url, id) => {
    return fetch(url).then(res => res.json())
}
const post = async (url, data) => {
    let dataType = getType(data);
    console.log(dataType);
    if (dataType === 'object') {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    }
    else if (dataType === 'array') {
        let arr = [];
        data.forEach((item, index) => {
            console.log(item);
            setTimeout(() => {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                })
                    .then(res => res.json())
                    .then(res => arr.push(res))
            }, 100 * index)
        })
        return arr;
    }
    // else if (dataType === 'array') {
    //     let arr = [];
    //     data.forEach((item,index) => {
    //         arr.push(new Promise((resolve, rejects) => {
    //             fetch(url, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(item)
    //             })
    //                 .then(res => res.json())
    //                 .then(res => {
    //                     setTimeout(() => resolve(res), 300 * index);
    //                     // resolve(res)
    //                 })
    //                 .catch(error => rejects({}))
    //         }))
    //     })
    //     return Promise.all(arr)
    // }
}

export const fetchApi = { get, post }
