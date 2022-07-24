import logger from '@logging';
import { IMiddleware } from 'graphql-middleware';

const middleware: IMiddleware = async (resolve, root, args, context, info) => {
  const parentName = info.path.prev;

  if (parentName) {
    const result = await resolve(root, args, context, info);
    return result;
  }

  const resolverName = info.fieldName;
  const operationName = info.operation.name?.value;

  logger.info(
    {
      resolver: resolverName,
      operation: operationName,
      ...(logger.level === 'info' && { args }),
    },
    `START: ${operationName}`
  );

  const result = await resolve(root, args, context, info);

  logger.info(
    {
      resolver: resolverName,
      operation: operationName,
      ...(logger.level === 'info' && { result }),
    },
    `FINISH: ${operationName}`
  );

  return result;
};

export default middleware;
