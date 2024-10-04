import { Server } from "../../app";
import { EditRequestService } from "app-db/dist/services/EditRequestService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  status: "pending" | "approved" | "declined";
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getManyEditRequestByStatus",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { status } = req.query;
      const editRequestService = new EditRequestService(repositoryController);

      try {
        const editRequests = await editRequestService.getManyByStatus(status);
        if (editRequests) {
          return res.send(editRequests);
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
