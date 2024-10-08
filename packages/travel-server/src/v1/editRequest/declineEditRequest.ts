import { PlaceService, EditRequestService, UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  placeId: string;
  userId: string;
  editRequestId: string;
  requestedChanges: any;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/declineEditRequest",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { placeId, userId, requestedChanges, editRequestId } = req.body;
      const editRequestService = new EditRequestService(repositoryController);
      const placeService = new PlaceService(repositoryController);
      const userService = new UserService(repositoryController);

      const [place, user, editRequest] = await Promise.all([
        placeService.getById(placeId), // Fetch Place by placeId
        userService.getById(userId), // Fetch User by userId
        editRequestService.getById(editRequestId),
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
      if (!editRequest) {
        const error = "Edit request not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (user.role !== "admin") {
        const error = "User not an admin";
        console.log(error);
        return res.status(404).send({ error });
      }
      const updatedEditRequest = await editRequestService.update({
        id: editRequestId,
        status: "declined",
        requestedChanges,
      });

      // TODO: Send me an email
      const message = "Edit request declined successfully";
      console.log(message);
      return res.status(200).send({ message, updatedEditRequest, status: 200 });
    },
  });

  return server;
}
