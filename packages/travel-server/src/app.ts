import Fastify from "fastify";

const server = Fastify({ logger: true });

const initApp = async () => {
  server.get("/healthcheck", async (request, reply) => {
    console.log("Hello world");
    return "200";
  });
  return server;
};

export const startApp = async () => {
  await initApp();
  await server.ready();

  await server.listen({
    host: "0.0.0.0",
    port: 3000,
  });
};
