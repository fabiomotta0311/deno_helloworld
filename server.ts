// deno run -c tsconfig.json mod.ts
import { listenAndServe } from "https://deno.land/std/http/server.ts";
import { fromFileUrl } from "https://deno.land/std/path/mod.ts";

listenAndServe({ port: 3000 }, async (req) => {
    if (req.method === "GET" && req.url === "/") {
      //Serve with hack
      const u = new URL("./index.html", import.meta.url);
      if (u.protocol.startsWith("http")) {
       
        fetch(u.href).then(async (resp) => {
          const body = new Uint8Array(await resp.arrayBuffer());
          return req.respond({
            status: resp.status,
            headers: new Headers({
              "content-type": "text/html",
            }),
            body,
          });
        });
      } else {
        // server launched by deno run ./server.ts
        const file = await Deno.open(fromFileUrl(u));
        req.respond({
          status: 200,
          headers: new Headers({
            "content-type": "text/html",
          }),
          body: file,
        });
      }
    }
});
console.log("http://localhost:3000");