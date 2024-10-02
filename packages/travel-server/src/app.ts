import Fastify from "fastify";
import v1 from "./v1";
import repositoryPlugin from "./plugins/repository.plugin";
import { RepositoryController } from "app-db/dist/contoller/RepositoryController";

declare module "fastify" {
  interface FastifyInstance {
    repositoryController: RepositoryController;
  }
}

const server = Fastify({ logger: true });
export type Server = typeof server;
const initApp = async () => {
  server.register(repositoryPlugin);

  server.get("/healthcheck", async (request, reply) => {
    console.log("Hello world");
    return "200";
  });
  v1(server);
  return server;
};

export const startApp = async () => {
  await initApp();
  await server.ready();

  await server.listen({
    host: "0.0.0.0",
    port: 8080,
  });
};
