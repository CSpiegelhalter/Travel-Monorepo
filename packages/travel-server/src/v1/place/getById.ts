import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string; // The 'id' query parameter should be a string
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getPlaceById",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { id, userId } = req.query;
      console.log("Here be the user id:");
      console.log(userId);
      const repositoryController = server.repositoryController;
      const placeService = new PlaceService(repositoryController);
      try {
        const place = await placeService.getById(id);

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
