addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        const msgList = await kv.get('msgList', "json");
        return new Response(JSON.stringify(msgList), {
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
