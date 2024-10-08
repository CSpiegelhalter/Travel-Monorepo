import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  userId: string;
  page?: number;
  pageSize?: number;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getEditedPlaces",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { userId, page, pageSize } = req.query;
      console.log("Here be the user id:");
      console.log(userId);
      const repositoryController = server.repositoryController;

      try {
        const placeService = new PlaceService(repositoryController);
        const places = await placeService.getEditedPlacesByUser(
          userId,
          page || 1,
          pageSize || 15
        );
        if (places) {
          return res.send(places);
        } else {
          return res
            .status(404)
            .send({ message: "No edited places not found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
