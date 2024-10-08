import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  userId?: string;
  page?: number;
  pageSize?: number;
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
      const { userId, page, pageSize } = req.query;

      console.log("did i die");

      const service = new PlaceService(repositoryController);

      const places = userId
        ? await service.getMany({ userId, page, pageSize })
        : await service.getMany({ page, pageSize });

      await res.send(places);
    },
  });

  return server;
}
