import { UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  username: string;
  email: string;
  userId: string;
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
      const { email, username, userId } = req.body;
      console.log(
        `Recieved user create request for email: ${email}, username: ${username}, userId: ${userId}`
      );

      const service = new UserService(repositoryController);
      const user = await service.create({ email, username, id: userId });
      console.log(user);
      await res.send(user);
    },
  });

  return server;
}
