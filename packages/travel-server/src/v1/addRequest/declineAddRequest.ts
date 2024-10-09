import { UserService, AddRequestService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  userId: string;
  addRequestId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/declineAddRequest",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { userId, addRequestId } = req.body;
      const addRequestService = new AddRequestService(repositoryController);
      const userService = new UserService(repositoryController);

      const [user, addRequest] = await Promise.all([
        userService.getById(userId), // Fetch User by userId
        addRequestService.getById(addRequestId),
      ]);

      if (!addRequest) {
        const error = "Add request not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (!user) {
        const error = "User not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (user.role !== "admin") {
        const error = "User not an admin";
        console.log(error);
        return res.status(404).send({ error });
      }
      const updatedAddRequest = await addRequestService.update({
        id: addRequestId,
        status: "declined",
      });

      // TODO: Send me an email
      const message = "Add request declined successfully";
      console.log(message);
      return res.status(200).send({ message, updatedAddRequest, status: 200 });
    },
  });

  return server;
}
