import { UserService, ProfilePictureService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/deleteProfilePicture",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { userId } = req.body;
      console.log(`Recieved request to delete profile pic, userId: ${userId}`);

      const userService = new UserService(repositoryController);
      const profilePicService = new ProfilePictureService(repositoryController);
      const user = await userService.getById(userId);

      if (!user) {
        return await res.send({ error: "User not found!" });
      }

      await profilePicService.delete({
        user,
      });

      return await res.send("OK!");
    },
  });

  return server;
}
