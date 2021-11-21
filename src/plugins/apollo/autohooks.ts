import { FastifyInstance } from 'fastify';

/**
 * @param {FastifyInstance} fastify The fastify instance
 */
export default async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.auth([
    fastify.verifyJWT,
  ]));
};
