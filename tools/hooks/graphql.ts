import {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  TypedDocumentNode,
  useMutation as useApolloMutation,
  useQuery,
  useLazyQuery,
} from '@apollo/client';
import { useToast } from '@chakra-ui/react';

const useMutation = <
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables, TContext>
): MutationTuple<TData, TVariables, TContext, TCache> => {
  const toast = useToast();

  return useApolloMutation(mutation, {
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
        isClosable: true,
      });
    },
    ...options,
    onCompleted: data => {
      for (const key in data) {
        const result = data[key] as unknown as { ok: boolean; error?: string };
        if (result.ok) continue;
        toast({
          status: 'error',
          description: result.error,
          isClosable: true,
        });
      }
      options?.onCompleted && options.onCompleted(data);
    },
  });
};

export { useQuery, useLazyQuery, useMutation };
