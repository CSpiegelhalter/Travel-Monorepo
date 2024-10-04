import { PlaceService } from "app-db";
import { Server } from "../../app";
import { EditRequestService } from "app-db/dist/services/EditRequestService";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "app-db/dist/services/UserService";

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
        return res.status(404).send({ error: "Place not found" });
      }
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const editRequest = await editRequestService.create({
        placeId,
        userId,
        requestedChanges,
      });
      // TODO: Send me an email
      return res
        .status(200)
        .send({ message: "Edit request submitted successfully", editRequest });
    },
  });

  return server;
}
