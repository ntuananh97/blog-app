# React Query API call guide for client-side data fetching

This project follows the rule: API requests must be triggered from client components only. Do not fetch data directly in a Server Component or in a route file that is rendered on the server.

## 1) Current pattern in this project

### App-level composition

`app/page.tsx` is a server component by default in the Next.js App Router. It renders `BlogList`, which is a client component.

```tsx
// app/page.tsx
import { BlogList } from "@/app/(main)/blog/_components/BlogList";

export default function Home() {
  return <BlogList />;
}
```

`app/(main)/blog/_components/BlogList.tsx` has the `'use client'` directive at the top, which makes it safe to use React Query hooks and fetch data in the browser.

```tsx
"use client";

import { useBlogs } from "@/features/blogs/api/get-blogs";

export function BlogList() {
  const { data } = useBlogs();
  const blogs = data?.blogs || [];

  return <div>{/* render UI */}</div>;
}
```

### React Query setup

The project wraps the app with a query provider in `app/layout.tsx` and `components/provider/reactQueryProvider.tsx`.

```tsx
// app/layout.tsx
import { ReactQueryProviders } from "@/components/provider/reactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
```

```tsx
// components/provider/reactQueryProvider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export function ReactQueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

```tsx
// lib/query-client.ts
import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}
```

This means React Query is available to all client-side screens, but the actual API logic still lives in feature files.

## 2) API layer pattern

The fetch layer is centralized in `features/blogs/api/get-blogs.ts`.

```tsx
import { useQuery, queryOptions } from "@tanstack/react-query";
import { httpRequest } from "@/lib/httpRequest";

export const getBlogs = () => {
  return httpRequest.get(`/blog/public`);
};

export const getBlogsQueryOptions = () => {
  return queryOptions({
    queryKey: ["blogs"],
    queryFn: () => getBlogs(),
  });
};

export const useBlogs = () => {
  return useQuery({
    ...getBlogsQueryOptions(),
  });
};
```

The pattern is:

1. Create a fetch function in the feature API layer.
2. Wrap it in `queryOptions()` with a unique `queryKey`.
3. Expose a `useXxx()` hook that calls `useQuery()`.
4. Use that hook in a client component.

This same pattern is used for detail fetches:

```tsx
export const getBlogById = (id: number) => {
  return httpRequest.get(`/blog/${id}`);
};

export const getBlogDetailQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["blogs", id],
    queryFn: () => getBlogById(id),
  });
};

export const useDetailBlog = (id: number) => {
  return useQuery({
    ...getBlogDetailQueryOptions(id),
    enabled: !!id,
  });
};
```

## 3) What to do next for AI / future work

### Required rule

Never call API logic from a server component.

Bad example:

```tsx
// app/blog/page.tsx (server component by default)
import { getBlogs } from "@/features/blogs/api/get-blogs";

export default async function BlogPage() {
  const data = await getBlogs(); // NOT allowed
  return <div>{data}</div>;
}
```

This is against the project rule because Next.js Server Components run on the server, and the project specifically requires browser-side API calls only.

### Correct pattern

Use a client component whenever you need data from the API.

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/features/blogs/api/get-blogs";

export function BlogList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {String(error)}</div>;

  return <div>{data?.blogs?.length ?? 0}</div>;
}
```

If a page is a server component by default, keep it as a thin wrapper and render a client component inside it.

```tsx
// server page
export default function Page() {
  return <BlogClient />;
}
```

Then perform the API call inside `BlogClient` with `useQuery()`.

## 4) Implementation checklist for future feature work

When adding a new API feature, do the following:

- Put the API function in the feature folder, e.g. `features/<feature>/api/get-<resource>.ts`.
- Use `httpRequest` for the actual fetch call.
- Create a unique `queryKey` for each resource.
- Expose a hook such as `useItems()` or `useItemDetail(id)`.
- Mark the component with `'use client'` before using `useQuery()`.
- Do not import the hook into a server component.
- Use `enabled` when the query depends on route params or a selected ID.
- Handle loading, empty, and error states in the component.

## 5) Example for a new feature

```tsx
// features/orders/api/get-orders.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/lib/httpRequest";

export const getOrders = () => httpRequest.get("/orders");

export const getOrdersQueryOptions = () =>
  queryOptions({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

export const useOrders = () => useQuery({ ...getOrdersQueryOptions() });
```

```tsx
"use client";

import { useOrders } from "@/features/orders/api/get-orders";

export function OrdersList() {
  const { data, isPending, isError } = useOrders();

  if (isPending) return <div>Loading orders...</div>;
  if (isError) return <div>Unable to load orders</div>;

  return <div>{data?.orders?.length ?? 0} orders</div>;
}
```

## 6) Final rule

The project’s canonical approach is:

- Server Component = route shell / layout / navigation / static composition.
- Client Component = all API calls and React Query logic.
- Do not fetch data inside server-rendered page files.

This project already follows the correct pattern in `app/page.tsx` and `app/(main)/blog/_components/BlogList.tsx`: the page is server-safe, while the API is consumed through a client component using React Query.
