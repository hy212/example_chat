addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
function getUrlParams(url) {
    const urlStr = url.split('?')[1];
    if (!urlStr) {
        return {};
    }
    const obj = {};
    const paramsArr = urlStr.split('&');
    for (let i = 0, len = paramsArr.length; i < len; i++) {
        const arr = paramsArr[i].split('=');
        obj[arr[0]] = arr[1];
    }
    return obj;
}
// const responseMsgs = [
//     '您好，客服正忙，请稍后联系。',
//     '您好，正在处理您的消息，请稍等。',
//     '您好，暂时无法回答您的问题。',
//     '您好，当前访问人数过多，请稍后再试。'
// ];
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        // const rspData = {
        //     code: 1,
        //     msg: '',
        //     data: {
        //         time: new Date().getTime(),
        //         chatMsg: ''
        //     }
        // };
        // let randomIndex = Math.floor(Math.random() * responseMsgs.length);
        // rspData.data.chatMsg = `[自动回复] ${responseMsgs[randomIndex]}`;
        // const msg = getUrlParams(req.url).msg;
        const queryArgs = req.json();
        // await kv.put('mgsList',value);
        const rspData = {
            code: 1,
            msg: '',
            data: { ...queryArgs }
        };
        return new Response(JSON.stringify(rspData), {
            headers: {
                "content-type": "application/json",
            },
        })
    } catch (e) {
        console.log("Got Exception: " + e.stack);
        return new Response("Got Exception: " + e.message, {
            headers: {
                "content-type": "application/json",
            },
        });
    }
}
