import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string; // The 'id' query parameter should be a string
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getPlaceById",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { id } = req.query;
      const repositoryController = server.repositoryController;

      try {
        const service = new PlaceService(repositoryController);
        const place = await service.getById(id);
        if (place) {
          return res.send(place);
        } else {
          return res.status(404).send({ message: "Place not found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
