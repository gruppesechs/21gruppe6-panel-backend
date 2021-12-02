/* eslint-disable max-len */
import * as crypto from 'crypto';
import fp from 'fastify-plugin';
import auth from 'fastify-auth';
import jwt, { FastifyJWTOptions } from 'fastify-jwt';
import { promises as fs } from 'fs';
import { FastifyInstance, FastifyRequest } from 'fastify';
import * as path from 'path';
import type { User } from '@prisma/client';
import type { LoginRequest, RegisterRequest } from '../types/requests';

interface KeyPair {
  public: string | Buffer,
  private: string | Buffer
}

/**
 * @returns {KeyPair} The key paie.
 */
async function loadJWTKeyPair(): Promise<KeyPair> {
  const jwk = await fs.readFile(`${path.join(__dirname, '..', '..', 'keys')}/privateKey.json`, 'utf8');

  const privateKey = crypto.createPrivateKey({
    key: JSON.parse(jwk),
    format: 'jwk',
  });

  const publicKey = crypto.createPublicKey(privateKey);

  return {
    public: publicKey.export({ format: 'pem', type: 'spki' }),
    private: privateKey.export({ format: 'pem', type: 'pkcs8' }),
  };
}

/**
 * @param {FastifyInstance} this The fastify instance.
 * @param {FastifyRequest} request The request.
 */
async function verifyJWT(this: FastifyInstance, request: FastifyRequest): Promise<void> {
  await request.jwtVerify();
}

/**
 * @param {FastifyInstance} this The fastify instance.
 * @param {FastifyRequest<LoginRequest>} request The login request.
 */
async function verifyUserAndPassword(this: FastifyInstance, request: FastifyRequest<LoginRequest>): Promise<void> {
  const { prisma } = this;

  const user = await prisma.user.findUnique({
    where: {
      email: request.body.email,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.password.startsWith('provisioning:')) {
    throw new Error('This account needs provisioning');
  }

  const passwordValid = await this.sodium.crypto_pwhash_str_verify(request.body.password, user.password);

  if (!passwordValid) {
    throw new Error('Invalid email or password');
  }

  request.user = user;
}

/**
 * @param {FastifyInstance} this The fastify instance.
 * @param {FastifyRequest<RegisterRequest>} request The register request.
 */
async function verifyUserAndProvisioningToken(this: FastifyInstance, request: FastifyRequest<RegisterRequest>): Promise<void> {
  const { prisma } = this;

  const user = await prisma.user.findUnique({
    where: {
      email: request.body.email,
    },
  });

  if (!user) {
    throw new Error('Invalid email or token');
  }

  if (!user.password.startsWith('provisioning:')) {
    throw new Error('This account is already registered');
  }

  if (user.password !== `provisioning:${request.body.provisioningToken}`) {
    throw new Error('Invalid email or token');
  }

  request.user = user;
}

/**
 * This plugins adds some utilities to handle authentication with fastify.
 *
 * @see https://github.com/fastify/fastify-auth
 * @see https://github.com/fastify/fastify-jwt
 */
export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(auth);
  fastify.register(jwt, {
    secret: await loadJWTKeyPair(),
  });

  fastify.decorate('verifyJWT', verifyJWT);
  fastify.decorate('verifyUserAndPassword', verifyUserAndPassword);
  fastify.decorate('verifyUserAndProvisioningToken', verifyUserAndProvisioningToken);
});

declare module 'fastify' {
  export interface FastifyInstance {
    verifyJWT: (this: FastifyInstance, request: FastifyRequest, reply: FastifyReply) => void;
    verifyUserAndPassword: (this: FastifyInstance, request: FastifyRequest) => void;
    verifyUserAndProvisioningToken: (this: FastifyInstance, request: FastifyRequest) => void;
  }
}

declare module 'fastify-jwt' {
  interface FastifyJWT {
    user: User
  }
}
