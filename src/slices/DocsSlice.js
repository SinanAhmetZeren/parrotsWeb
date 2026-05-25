import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listDocs: builder.query({ query: () => "/api/account/admin/docs" }),
    getDoc: builder.query({ query: (filePath) => `/api/account/admin/docs/${filePath}` }),
    saveDoc: builder.mutation({
      query: ({ filePath, content }) => ({
        url: `/api/account/admin/docs/${filePath}`,
        method: "PUT",
        body: { content },
      }),
    }),
  }),
});

export const { useListDocsQuery, useLazyGetDocQuery, useSaveDocMutation } = extendedApiSlice;
