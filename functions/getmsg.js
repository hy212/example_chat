addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
const headers = {
    "content-type":  "application/json; charset=utf-8",
};
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        // 解码utf-8数据
        const msgList = await kv.get('msgList', "json");
        const rspData = {
            code: 1,
            msg: '',
            data: msgList || [],
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
