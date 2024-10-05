import { UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getUserById",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { id } = req.query;
      const userService = new UserService(repositoryController);

      try {
        const user = await userService.getById(id);
        if (user) {
          console.log("Found user!");
          return res.send(user);
        } else {
          return res.status(404).send({ message: "User not found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
