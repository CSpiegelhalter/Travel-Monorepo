import { AddRequestService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  status: "pending" | "approved" | "declined";
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getAllAddRequestsByStatus",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { status } = req.query;
      const addRequestService = new AddRequestService(repositoryController);

      try {
        const addRequests = await addRequestService.getManyByStatus(status);
        if (addRequests) {
          return res.send(addRequests);
        } else {
          return res.status(404).send({ message: "addRequests not found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
