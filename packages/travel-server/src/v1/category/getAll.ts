import { CategoryService } from "app-db";
import { Server } from "../../app";
import { EditRequestService } from "app-db/dist/services/EditRequestService";
import { FastifyRequest, FastifyReply } from "fastify";

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getAllCategories",
    handler: async (req: FastifyRequest, res: FastifyReply) => {
      const repositoryController = server.repositoryController;
      const categoryService = new CategoryService(repositoryController);

      try {
        const categories = await categoryService.getAll();
        if (categories) {
          return res.send(categories);
        } else {
          return res.status(404).send({ message: "No categories found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
