import { Server } from "../../app";
import { EditRequestService } from "app-db/dist/services/EditRequestService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getEditRequestById",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { id } = req.query;
      const editRequestService = new EditRequestService(repositoryController);

      try {
      const editRequest = await editRequestService.getById(id);
      if (editRequest) {
        return res.send(editRequest);
      } else {
        return res.status(404).send({ message: "EditRequest not found" });
      }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
