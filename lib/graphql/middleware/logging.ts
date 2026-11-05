import logger from '@logging';
import { IMiddleware } from 'graphql-middleware';

type MiddlewareResolver = Extract<IMiddleware, (...args: any[]) => any>;

const logRoot: MiddlewareResolver = async (resolve, root, args, context, info) => {
  const resolverName = info.fieldName;
  const operationName = info.operation.name?.value;
  const operationLabel = operationName || resolverName;
  const startTime = Date.now();
  const logContext = {
    resolver: resolverName,
    operation: operationLabel,
  };

  logger.info(
    {
      ...logContext,
      ...(logger.level === 'debug' && { args }),
    },
    `START: ${operationLabel}`
  );

  try {
    const result = await resolve(root, args, context, info);

    logger.info(
      {
        ...logContext,
        durationMs: Date.now() - startTime,
      },
      `FINISH: ${operationLabel}`
    );

    return result;
  } catch (error) {
    logger.error(
      {
        ...logContext,
        durationMs: Date.now() - startTime,
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : error,
      },
      `ERROR: ${operationLabel}`
    );
    throw error;
  }
};

const middleware: MiddlewareResolver = (resolve, root, args, context, info) => {
  // Nested scalar fields are often synchronous; wrapping each one creates avoidable promises.
  if (info.path.prev) return resolve(root, args, context, info);
  return logRoot(resolve, root, args, context, info);
};

export default middleware;
