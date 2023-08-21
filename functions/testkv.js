addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
const headers = {
    "content-type":  "application/json; charset=utf-8",
};
const kvName = 'test';
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        // 转成utf-8字节流存储
        await kv.delete('msgList');
        const queryArgs = await req.json();
        queryArgs.code = decodeURIComponent(queryArgs.code);
        const testObj = { test: '哈哈哈', queryArgs };
        const testStr = JSON.stringify(testObj);
        let encoder = new TextEncoder('UTF-8');
        const msgListStr = encoder.encode(testStr);
        await kv.put(kvName, msgListStr);
        // 解码utf-8数据
        // const msgList = await kv.get('msgList', "json");
        const msgList = await kv.get(kvName, 'arrayBuffer');
        let decoder = new TextDecoder('UTF-8');
        const list = decoder.decode(msgList);
        const rspData = {
            code: 1,
            msg: '',
            data: list || [],
            testStr,
            testStrInput: msgListStr,
            testStrOutput: list,
            output: msgList,
            queryArgs,
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
