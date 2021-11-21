import fp from 'fastify-plugin';
import { SodiumPlus } from 'sodium-plus';

export default fp<void>(async (fastify) => {
  const sodium = await SodiumPlus.auto();

  fastify.decorate('sodium', sodium);
});

declare module 'fastify' {
  interface FastifyInstance {
    sodium: SodiumPlus
  }
}
