import { Server } from "../../app";
import { UserService } from "app-db/dist/services/UserService";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  username: string;
  email: string;
  id: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/createUser",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { email, username, id } = req.body;

      const service = new UserService(repositoryController);
      const user = await service.create({ email, username, id });
      console.log(user);
      await res.send(user);
    },
  });

  return server;
}
