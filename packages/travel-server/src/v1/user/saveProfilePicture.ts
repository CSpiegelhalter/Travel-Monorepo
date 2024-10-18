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

      const profilePic = await profilePicService.create({
        src: imageUrl,
        user,
      });

      if (profilePic) {
        return await res.send(profilePic);
      }

      return await res.send({ error: "Failed to create profile picture..." });
    },
  });

  return server;
}
