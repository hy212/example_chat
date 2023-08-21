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
        curMsgs.push(queryArgs);
        await kv.put('mgsList', curMsgs);
        const rspData = {
            code: 1,
            msg: '',
            data: queryArgs
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
