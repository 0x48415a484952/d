
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // Default DoH endpoint (you can change this to any DoH server)
    const DOH_ENDPOINT = "https://cloudflare-dns.com/dns-query";

    // Build the target URL using the base endpoint and original query string
    const targetUrl = DOH_ENDPOINT + url.search;

    // Clone the incoming request and forward it to the target DoH server
    const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method === 'POST' ? request.body : undefined,
        redirect: 'follow',
    });

    try {
        // Forward the request and get the response from the DoH server
        const response = await fetch(modifiedRequest);

        // Return the response back to the client
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        // Return an error response if the request fails
        return new Response('Error fetching the target DoH server.', { status: 500 });
    }
}
