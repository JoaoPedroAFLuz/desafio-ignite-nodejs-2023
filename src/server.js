import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.path.test(url) && route.method === method
  );

  if (!route) {
    return res.writeHead(404).end();
  }

  const routeParams = req.url.match(route.path);

  const { query, ...params } = routeParams.groups;

  req.params = params;
  req.query = query ? extractQueryParams(query) : {};

  return route.handler(req, res);
});

server.listen(3333, () => {
  console.log("Server running on http://localhost:3333");
});
