import { createServer } from "http"

const server = createServer(async (request, response) => {
    try {
        const parsed_url = new URL(request.url, `http://${request.headers.host}`)
        const path = parsed_url.pathname;
        console.log(`${request.method} ${path}`);
        if(path === "/health" && request.method === "GET") {
            return handleHealth(request, response);
        }
        if(path === "/users" && request.method === "GET") {
            return activeUsers(request, response, parsed_url);
        }
        if(path === "/echo" && request.method === "POST") {
            return await echoMessage(request, response);
        }
        if(path === "/headers" && request.method === "GET") {
            return sendHeaders(request, response);
        }
        notFound(response);   
    } catch (e) {
        serverError(response);
    }
});

const port = process.env.PORT || 3000

server.listen(port, () => {console.log("сервер запущен")});

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function notFound(res) {
    return sendJson(res, 404, { message: 'Route not found' });
}

function handleHealth(req, res) {
    return sendJson(res, 200, { status: 'ok' });
}

function activeUsers(req, res, url) {
    const list =[{name: "Alice"}, {name: "Bob"}];
    const name = url.searchParams.get("name");
    if(name) {
        return sendJson(res, 200, {users: list.filter(val => val.name === name)})
    }
    return sendJson(res, 200, { users: list });
}

async function echoMessage(res) {
    try {
        const body = await readJson(req);
        sendJson(res, 200, {parsed: body});
    } catch (error) {
        sendJson(res, 400, {error: "Invalid JSON"});
    }
}

function serverError(res) {
    sendJson(res, 500, {message: "Internal Server Error"})
}

function readJson(req) {
    return new Promise((res, rej) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            try {
                res(body ? JSON.parse(body) : {});
            } catch (e) {
                rej(new Error());
            }
        })
        req.on("error", rej);
    })
}

function sendHeaders(req, res) {
    sendJson(res, 200, {headers: req.headers});
}