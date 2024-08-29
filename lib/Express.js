const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

const { routeNotFound } = require("../utils/route-not-found");
const { JSONToObject } = require("../../raw-node-api/utils/JSONToObject");

class Express {
  constructor() {
    this.routes = {}; // Store routes based on method and path
    this.middlewares = []; // Store middlewares

    this.server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      req.path = parsedUrl.pathname.replace(/^(.*?[^/])\/$/, "$1") || "/";
      req.query = parsedUrl.query;
      req.body = "";

      // Body Data
      const decoder = new StringDecoder("utf8");
      req.on("data", (buffer) => {
        req.body += decoder.write(buffer);
      });

      req.on("end", async () => {
        req.body += decoder.end();
        req.body = JSONToObject(req.body?.trim()) || {};

        // Response methods
        res.setHeader("Content-Type", "application/json");
        res.status = (code = 200) => {
          res.writeHead(code);
          return res;
        };
        res.json = (data = {}) => {
          if (!res.writableEnded) res.end(JSON.stringify(data));
        };

        try {
          // Execute middlewares
          for (const middleware of this.middlewares) {
            await middleware(req, res);
            if (res.writableEnded) return;
          }

          // Handle Route
          const route = `${req.method.toUpperCase()}${req.path}`;
          const routeHandler = this.routes[route] || routeNotFound;

          if (Array.isArray(routeHandler)) {
            for (let i = 0; i < routeHandler.length; i++) {
              await new Promise((resolve, reject) => {
                routeHandler[i](req, res, (err) => {
                  if (err) reject(err);
                  else resolve();
                });
              });
              if (res.writableEnded) return;
            }
          } else {
            await routeHandler(req, res);
          }

          if (!res.writableEnded) {
            res.status(404).json({ error: "Not Found" });
          }
        } catch (error) {
          console.error("Error processing request:", error);
          if (!res.writableEnded) {
            res.status(500).json({ error: "Internal Server Error" });
          }
        }
      });
    });
  }

  // Listen the server
  listen(port, hostname, callback) {
    if (typeof hostname === "function") {
      callback = hostname;
      hostname = "localhost";
    }

    this.server.listen(port, hostname, callback);
  }

  // Methods
  get(path, ...handler) {
    this.routes[`GET${path}`] = handler;
  }

  post(path, ...handler) {
    this.routes[`POST${path}`] = handler;
  }

  put(path, ...handler) {
    this.routes[`PUT${path}`] = handler;
  }

  patch(path, ...handler) {
    this.routes[`PATCH${path}`] = handler;
  }

  delete(path, ...handler) {
    this.routes[`DELETE${path}`] = handler;
  }

  // Middleware
  use(...middlewares) {
    this.middlewares.push(...middlewares);
  }
}

module.exports = Express;
