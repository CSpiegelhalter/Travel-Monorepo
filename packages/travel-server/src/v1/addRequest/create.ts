import {
  PlaceService,
  EditRequestService,
  UserService,
  AddRequestService,
} from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  userId: string;
  placeData: any;
  additionalComments?: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/createAddRequest",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { placeData, userId, additionalComments } = req.body;

      console.log("Here theybe");

      console.log(additionalComments);
      const userService = new UserService(repositoryController);
      const addRequestService = new AddRequestService(repositoryController);
      const user = await userService.getById(userId);

      if (!user) {
        const error = "User not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      const addRequest = await addRequestService.create({
        user,
        placeData,
        additionalComments,
      });
      if (!addRequest) {
        const error = "Add request not created";
        console.log(error);
        return res.status(404).send({ error });
      }

      // TODO: Send me an email
      const message = "Add request submitted successfully";
      console.log(message);
      return res.status(200).send({ message, addRequest, status: 200 });
    },
  });

  return server;
}
