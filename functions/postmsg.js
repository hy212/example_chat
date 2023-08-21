addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
const headers = {
    "content-type": "application/json",
};
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        const queryArgs = await req.json();
        //
        const curMsgs = await kv.get('msgList', "json");
        const msgList = curMsgs || [];
        msgList.push(queryArgs);
        await kv.put('mgsList', msgList);
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
