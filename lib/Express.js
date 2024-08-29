const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

const { routeNotFound } = require("../utils/route-not-found");
const { JSONToObject } = require("../../raw-node-api/utils/JSONToObject");

class Express {
  constructor() {
    this.routes = {}; // Store routes based on method and path
    this.middlewares = []; // Store middlewares

    this.server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      req.path = parsedUrl.pathname.replace(/^(.*?[^/])\/$/, "$1");
      req.query = parsedUrl.query;
      req.body = "";

      // Handle Route
      const route = `${req.method.toUpperCase()}${req.path}`;
      const routeHandler = this.routes[route] || routeNotFound;

      // Body Data
      const decoder = new StringDecoder("utf8");
      req.on("data", (buffer) => {
        req.body += decoder.write(buffer);
      });

      req.on("end", () => {
        req.body += decoder.end();
        req.body = JSONToObject(req.body?.trim()) || {};

        // Response
        res.setHeader("Content-Type", "application/json");
        res.status = (code = 200) => res.writeHead(code);
        res.json = (data = {}) => res.end(JSON.stringify(data));

        routeHandler(req, res);
      });
    });
  }

  listen(port, hostname, callback) {
    if (typeof hostname === "function") {
      callback = hostname;
      hostname = "localhost";
    }

    this.server.listen(port, hostname, callback);
  }

  get(path, handler) {
    this.routes[`GET${path}`] = handler;
  }

  post(path, handler) {
    this.routes[`POST${path}`] = handler;
  }
}

module.exports = Express;
