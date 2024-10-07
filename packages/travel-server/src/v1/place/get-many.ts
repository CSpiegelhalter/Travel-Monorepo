import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  userId?: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getManyPlaces",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      console.log("am i even getting here??");
      const { userId } = req.query;
      console.log("did i die");

      const service = new PlaceService(repositoryController);
      console.log("did i get the service???");
      const places = await service.getMany(userId);
      console.log(places);
      await res.send(places);
    },
  });

  return server;
}
