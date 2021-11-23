import { ApolloServer } from 'apollo-server-fastify';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { buildSchema } from 'type-graphql';
// eslint-disable-next-line import/no-extraneous-dependencies
import { resolvers } from '@generated/type-graphql';

/**
 * @param {FastifyInstance} fastify The fastify instance
 * @returns {ApolloServerPlugin} An Apollo server plugin
 */
function fastifyAppClosePlugin(fastify: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await fastify.close();
        },
      };
    },
  };
}

/**
 * This plugins adds the Apollo Server
 */
export default fp<void>(async (fastify) => {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });
  const server = new ApolloServer({
    schema,
    context: ({ request }) => ({
      prisma: fastify.prisma,
      user: request.user,
    }),
    plugins: [
      fastifyAppClosePlugin(fastify),
      ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
    ],
  });

  await server.start();
  fastify.register(server.createHandler({
    cors: false,
  }));
});
