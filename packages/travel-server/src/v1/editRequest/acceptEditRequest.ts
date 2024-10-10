import {
  PlaceService,
  EditRequestService,
  UserService,
  ImageService,
} from "app-db";
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
    url: "/v1/acceptEditRequest",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { placeId, userId, requestedChanges, editRequestId } = req.body;
      const editRequestService = new EditRequestService(repositoryController);
      const placeService = new PlaceService(repositoryController);
      const userService = new UserService(repositoryController);
      const imageService = new ImageService(repositoryController);

      const [place, adminUser, editRequest] = await Promise.all([
        placeService.getEditedUsers(placeId),
        userService.getById(userId),
        editRequestService.getById(editRequestId),
      ]);

      if (!place) {
        const error = "Place not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (!adminUser) {
        const error = "Admin user not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (!editRequest) {
        const error = "Edit request not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (adminUser.role !== "admin") {
        const error = "User not an admin";
        console.log(error);
        return res.status(403).send({ error });
      }

      const submittedUser = await userService.getById(editRequest.user.id);

      const { savedCount, images, isSaved, ...basePlace } = place as any;
      console.log("wtffff");
      console.log(basePlace);

      // Handle addedImages: create new Image entries
      if (requestedChanges.addedImages) {
        for (const imageUrl of requestedChanges.addedImages) {
          await imageService.create({ src: imageUrl, place: basePlace });
        }
      }

      // Handle deletedImages: remove Image entries
      if (requestedChanges.deletedImages) {
        for (const imageUrl of requestedChanges.deletedImages) {
          await imageService.delete({ src: imageUrl, place: basePlace });
        }
      }

      const updatedEditedByUsers = place.editedByUsers.some(
        (u) => u.id === submittedUser.id
      )
        ? place.editedByUsers
        : [...place.editedByUsers, submittedUser];

      const { addedImages, deletedImages, ...changesWithoutImages } =
        requestedChanges;

      const updatedRequestedChanges = {
        ...changesWithoutImages,
        editedByUsers: updatedEditedByUsers,
      };
      console.log("changes:");
      console.log(updatedRequestedChanges);

      const [updatedEditRequest, updatedPlace] = await Promise.all([
        editRequestService.update({
          id: editRequestId,
          status: "accepted",
          requestedChanges,
        }),
        placeService.updatePlace(placeId, updatedRequestedChanges),
      ]);

      // TODO: Send an email notification
      const message = "Edit request accepted successfully";
      console.log(message);
      return res
        .status(200)
        .send({ message, updatedEditRequest, updatedPlace, status: 200 });
    },
  });

  return server;
}
