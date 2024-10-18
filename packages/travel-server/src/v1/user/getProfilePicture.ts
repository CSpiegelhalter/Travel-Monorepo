import { ProfilePictureService, UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getProfilePicture",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { userId } = req.query;
      console.log(`Fetching profile pic for userId: ${userId}`);

      const userService = new UserService(repositoryController);
      const profilePicService = new ProfilePictureService(repositoryController);
      try {
        const user = await userService.getById(userId);

        if (!user) {
          return await res.status(404).send({ message: "User not found" });
        }
        const pic = await profilePicService.getProfilePicture(user);

        return await res.status(200).send(pic);
      } catch (e) {
        return await res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
