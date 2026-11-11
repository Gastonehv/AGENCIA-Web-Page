// agencIA: si un agente pide Markdown (Accept: text/markdown), se lo damos.
// La portada entrega /index.md y las rutas que no existen entregan /404.md con estado 404.
export default (async (req, context)=>{
  const accept = req.headers.get("accept") || "";
  if (!/text\/markdown/i.test(accept)) return;
  const url = new URL(req.url);
  const md = (body, status)=>new Response(body, {
      status,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "vary": "Accept"
      }
    });
  if (url.pathname === "/" || url.pathname === "/index.html") {
    const r = await fetch(new URL("/index.md", url));
    return md(await r.text(), 200);
  }
  const res = await context.next();
  if (res.status === 404) {
    const r = await fetch(new URL("/404.md", url));
    return md(await r.text(), 404);
  }
  return res;
});
export const config = {
  path: "/*",
  excludedPath: [
    "/assets/*",
    "/audio/*",
    "/*.png",
    "/*.jpg",
    "/*.svg",
    "/*.ico",
    "/*.mp4",
    "/*.md",
    "/*.txt",
    "/*.xml",
    "/*.css",
    "/*.js"
  ]
};
