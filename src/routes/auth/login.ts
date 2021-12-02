import { FastifyPluginAsync } from 'fastify';
import { LoginRequest } from '../../types/requests';

const login: FastifyPluginAsync = async (fastify): Promise<void> => {
  const opts = {
    preHandler: fastify.auth([fastify.verifyUserAndPassword]),
  };
  fastify.post<LoginRequest>('/login', opts, async (request) => {
    const token = fastify.jwt.sign({
      userId: request.user.id,
      role: request.user.role,
    });

    return { token };
  });
};

export default login;
