import { PlaceService, EditRequestService, UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  placeId: string;
  userId: string;
  requestedChanges: any;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/createEditRequest",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { placeId, userId, requestedChanges } = req.body;
      const editRequestService = new EditRequestService(repositoryController);
      const placeService = new PlaceService(repositoryController);
      const userService = new UserService(repositoryController);

      const [place, user] = await Promise.all([
        placeService.getById(placeId), // Fetch Place by placeId
        userService.getById(userId), // Fetch User by userId
      ]);

      if (!place) {
        const error = "Place not found";
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
      const editRequest = await editRequestService.create({
        placeId,
        userId,
        requestedChanges,
      });
      // TODO: Send me an email
      const message = "Edit request submitted successfully";
      console.log(message);
      return res.status(200).send({ message, editRequest, status: 200 });
    },
  });

  return server;
}
