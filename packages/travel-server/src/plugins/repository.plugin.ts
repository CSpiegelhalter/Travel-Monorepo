import { repositoryController } from "app-db/dist/contoller/RepositoryController";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

// Define the plugin options type (empty in this case)
interface RepositoryPluginOptions {}

// Create the plugin with the correct Fastify types
const repositoryPlugin: FastifyPluginCallback<RepositoryPluginOptions> = async (
  fastify: FastifyInstance
) => {
  // Initialize the repository controller
  await repositoryController.initializeRepositories();

  // Decorate Fastify instance with the repository controller
  fastify.decorate("repositoryController", repositoryController);
};

// Export the plugin using fastify-plugin with the correct typing
export default fp(repositoryPlugin, {
  name: "repository-plugin",
});
