import { AddRequestService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getAddRequestById",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { id } = req.query;
      const addRequestService = new AddRequestService(repositoryController);

      try {
        const addRequest = await addRequestService.getById(id);
        if (addRequest) {
          return res.send(addRequest);
        } else {
          return res.status(404).send({ message: "addRequest not found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
