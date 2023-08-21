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
        // 乱码问题处理
        queryArgs.msg = decodeURIComponent(queryArgs.msg);
        queryArgs.username = decodeURIComponent(queryArgs.username);
        //获取kv数据
        const curMsgs = await kv.get(kvName, "json");
        const msgList = curMsgs || [];
        msgList.push(queryArgs);
        await kv.put(kvName, JSON.stringify(msgList));
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
