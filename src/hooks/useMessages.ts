import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messages } from '@/lib/api';
import { toast } from 'sonner';

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const PAGE_SIZE = 50;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam = 0 }) =>
      messages.getMessages(conversationId, {
        offset: pageParam,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.offset + PAGE_SIZE : undefined,
    keepPreviousData: true,
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: messages.sendMessage,
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', conversationId], (old: any) => ({
        pages: old.pages.map((page: any, i: number) =>
          i === 0
            ? { ...page, messages: [newMessage, ...page.messages] }
            : page
        ),
        pageParams: old.pageParams,
      }));
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  return {
    messages: data?.pages.flatMap((page) => page.messages) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    sendMessage,
  };
};