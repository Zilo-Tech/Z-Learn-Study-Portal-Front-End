import api from '@/lib/api';

export const CommunityAPI = {
  // Feed
  listFeed: (params?: { author?: number; group?: number; visibility?: string }) =>
    api.get('/feed/', { params }),
  createFeedPost: (data: { content: string; attachments?: string[]; visibility?: 'public'|'group'|'followers'; group?: number }) =>
    api.post('/feed/', data),
  getFeedPost: (id: number) => api.get(`/feed/${id}/`),
  updateFeedPost: (id: number, data: Partial<{ content: string; attachments: string[]; visibility: string }>) =>
    api.patch(`/feed/${id}/`, data),
  deleteFeedPost: (id: number) => api.delete(`/feed/${id}/`),

  // Comments
  listComments: (post: number) => api.get('/feed-comments/', { params: { post } }),
  createComment: (data: { post: number; content: string; parent?: number }) => api.post('/feed-comments/', data),

  // Groups
  listGroups: () => api.get('/groups/'),
  createGroup: (data: { name: string; description?: string; is_public?: boolean; tags?: string[]; region?: string }) => api.post('/groups/', data),
  getGroup: (id: number) => api.get(`/groups/${id}/`),
  updateGroup: (
    id: number,
    data: Partial<{ name: string; description: string; is_public: boolean; tags: string[]; region: string }>
  ) => api.patch(`/groups/${id}/`, data),
  deleteGroup: (id: number) => api.delete(`/groups/${id}/`),

  // Threads
  listThreads: (group: number) => api.get('/threads/', { params: { group } }),
  createThread: (data: { title: string; category?: string; group: number }) => api.post('/threads/', data),
  getThread: (id: number) => api.get(`/threads/${id}/`),
  updateThread: (
    id: number,
    data: Partial<{ title: string; category: string; group: number }>
  ) => api.patch(`/threads/${id}/`, data),
  deleteThread: (id: number) => api.delete(`/threads/${id}/`),

  // Thread posts
  listThreadPosts: (thread: number) => api.get('/thread-posts/', { params: { thread } }),
  createThreadPost: (data: { thread: number; content: string; parent?: number }) => api.post('/thread-posts/', data),
  updateThreadPost: (
    id: number,
    data: Partial<{ content: string; parent: number }>
  ) => api.patch(`/thread-posts/${id}/`, data),
  deleteThreadPost: (id: number) => api.delete(`/thread-posts/${id}/`),

  // Reactions
  listReactions: (contentType: string, objectId: number) => api.get('/reactions/', { params: { content_type: contentType, object_id: objectId } }),
  createReaction: (data: { content_type: string; object_id: number; type: string }) => api.post('/reactions/', data),
  deleteReaction: (id: number) => api.delete(`/reactions/${id}/`),

  // DM
  listConversations: () => api.get('/dm/conversations/'),
  createConversation: (participants: number[]) => api.post('/dm/conversations/', { participants }),
  listMessages: (conversation: number) => api.get('/dm/messages/', { params: { conversation } }),
  sendMessage: (conversation: number, content: string) => api.post('/dm/messages/', { conversation, content }),
};

