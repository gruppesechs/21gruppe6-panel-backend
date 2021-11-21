import { FastifyPluginAsync } from 'fastify';
import { RegisterRequest } from '../../types/requests';

const login: FastifyPluginAsync = async (fastify): Promise<void> => {
  const opts = {
    preHandler: fastify.auth([fastify.verifyUserAndProvisioningToken]),
  };
  fastify.post<RegisterRequest>('/register', opts, async (request, reply) => {
    const password = await fastify.sodium.crypto_pwhash_str(
      request.body.password,
      fastify.sodium.CRYPTO_PWHASH_OPSLIMIT_SENSITIVE,
      fastify.sodium.CRYPTO_PWHASH_MEMLIMIT_SENSITIVE,
    );

    await fastify.prisma.user.update({
      where: {
        email: request.body.email,
      },
      data: {
        password: password.replace(/\0/g, ''),
      },
    });

    reply.code(204);
  });
};

export default login;
