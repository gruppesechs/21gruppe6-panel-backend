import { NonEmptyArray } from 'type-graphql';
import {
  FindUniqueConfigResolver,
  FindManyContractResolver,
  FindUniqueUserResolver,
  UserRelationsResolver,
  BriefcaseSaleRelationsResolver,
  TransferRelationsResolver,
} from '@generated/type-graphql';

export default [
  FindUniqueConfigResolver,
  FindManyContractResolver,
  FindUniqueUserResolver,
  UserRelationsResolver,
  BriefcaseSaleRelationsResolver,
  TransferRelationsResolver,
] as unknown as NonEmptyArray<Function>;
