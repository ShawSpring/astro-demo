declare type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
};
declare type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const posts: Post[] = await fetch(
  "https://jsonplaceholder.typicode.com/posts"
).then((res) => res.json());

const users: User[] = await Promise.all(
  [...new Set(posts.map((post) => post.userId))].map((id) =>
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) =>
      res.json()
    )
  )
);

export { posts, users };
