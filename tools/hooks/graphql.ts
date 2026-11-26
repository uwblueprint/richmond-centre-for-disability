import {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  LazyQueryHookOptions,
  LazyQueryResultTuple,
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useMutation as useApolloMutation,
  useQuery as useApolloQuery,
  useLazyQuery as useApolloLazyQuery,
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

const useQueryErrorToast = () => {
  const toast = useToast();

  return (error: Error) => {
    if (toast.isActive(error.message)) return;
    toast({
      id: error.message,
      status: 'error',
      description: error.message,
      isClosable: true,
    });
  };
};

const useQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  const showError = useQueryErrorToast();

  return useApolloQuery(query, { onError: showError, ...options });
};

const useLazyQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<TData, TVariables>
): LazyQueryResultTuple<TData, TVariables> => {
  const showError = useQueryErrorToast();

  return useApolloLazyQuery(query, { onError: showError, ...options });
};

export { useQuery, useLazyQuery, useMutation };
