import { PlaceService, UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getUserProfile",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { id } = req.query;
      console.log('here be the user id')
      console.log(id)
      const userService = new UserService(repositoryController);
      const placeService = new PlaceService(repositoryController);

      try {
        const [user, counts] = await Promise.all([
          userService.getById(id),
          placeService.getUserRelatedCounts(id),
        ]);
        if (user) {
          console.log("Found user!");
          return res.send({ user, counts });
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
