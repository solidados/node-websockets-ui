import * as fs from "fs";
import * as path from "path";
import * as http from "http";

export const httpServer: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer(function (req, res) {
  const __dirname: string = path.resolve(path.dirname(""));
  const file_path: string =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  fs.readFile(
    file_path,
    function (err: NodeJS.ErrnoException | null, data: Buffer) {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify(JSON.stringify({ error: "File not found" })));
        return;
      }
      res.writeHead(200);
      res.end(data);
    },
  );
});
