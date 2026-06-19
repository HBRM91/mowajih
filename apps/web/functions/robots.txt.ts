export const onRequest: PagesFunction = async () => {
  const body = `User-agent: *
Allow: /

Sitemap: https://tawjih.jad2advisory.com/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
