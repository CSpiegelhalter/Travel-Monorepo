import { UserService, ProfilePictureService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  imageUrl: string;
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/saveProfilePicture",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { imageUrl, userId } = req.body;
      console.log(`Recieved request to save profile pic, userId: ${userId}`);

      const userService = new UserService(repositoryController);
      const profilePicService = new ProfilePictureService(repositoryController);
      const user = await userService.getById(userId);

      if (!user) {
        return await res.send({ error: "User not found!" });
      }

      // Unlink the old profile picture from the user
      await userService.saveProfilePicture({
        userId,
        profilePicture: null, // Unlink the old profile picture first
      });

      // Now it's safe to delete the old profile picture
      await profilePicService.delete({
        user,
      });

      // Create the new profile picture
      const profilePic = await profilePicService.create({
        src: imageUrl,
        user,
      });

      // Link the new profile picture to the user
      await userService.saveProfilePicture({
        userId,
        profilePicture: profilePic,
      });

      if (profilePic) {
        return await res.send({ ...profilePic, status: 200 });
      }

      return await res.send({ error: "Failed to create profile picture..." });
    },
  });

  return server;
}
