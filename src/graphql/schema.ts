import { buildSchema } from 'type-graphql';
import resolvers from './resolvers';

const schema = buildSchema({
  resolvers,
  validate: false,
});

export default schema;
