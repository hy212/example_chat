addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
const headers = {
    "content-type": "application/json; charset=utf-8",
};
const kvName = 'msgList';
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        const queryArgs = await req.json();
        //
        const curMsgs = await kv.get(kvName, "json");
        const msgList = curMsgs || [];
        msgList.push(queryArgs);
        // 转成utf-8字节流存储
        let encoder = new TextEncoder('UTF-8');
        const msgListStr = encoder.encode(JSON.stringify(msgList));
        await kv.put(kvName, msgListStr);
        const rspData = {
            code: 1,
            msg: '',
            data: queryArgs,
            msgList
        };
        return new Response(JSON.stringify(rspData), {
            headers,
        })
    } catch (e) {
        console.log("Got Exception: " + e.stack);
        return new Response("Got Exception: " + e.message, {
            headers,
        });
    }
}
