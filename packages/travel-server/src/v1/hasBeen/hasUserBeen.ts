import { HasBeenService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  placeId: string;
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/hasUserBeen",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { placeId, userId } = req.query;

      const repositoryController = server.repositoryController;
      const hasBeenService = new HasBeenService(repositoryController);
      try {
        const hasBeen = await hasBeenService.hasUserBeen(userId, placeId);
        return res.send(hasBeen);
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}

