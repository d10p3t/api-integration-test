import fetch, { FetchError } from "node-fetch";

import { Graph } from "./graph";
import { Test } from "./test";

/**
 * All extending classes should provide a base url in their constructors.
 *
 * Please use the protected baseUrl when constructing the endpoint URL for fetch.
 */
abstract class ThirdPartyApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * A convenience method for producing API endpoint paths using the provided baseUrl.
   *
   * e.g. fetch(this.withBaseUrl("/posts"))
   */
  withBaseUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  /**
   * A wrapper for fetch that returns the body of a response and does the error handling.
   *
   * e.g. this.get("/posts")
   */
   async get(path: string): Promise<any> {
    try {
      const response = await fetch(this.withBaseUrl(path));
      const data = await response.json();
      return data
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(`Endpoint: ${this.baseUrl}${path}|Code: ${error.code}|Message: ${error.message}`);
      }
    }
  }
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

class PostsApi extends ThirdPartyApiClient {
  async iteratePosts(
    callback: (post: Post) => void
  ): Promise<void> {
    // How to implement: Use node-fetch to fetch posts from the API, iterate through them and call the callback
    // with each and every post.
    const response: Post[] = await this.get("/posts");
    response.forEach((post) => callback(post))
  }
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

class UsersApi extends ThirdPartyApiClient {
  async iterateUsers(
    callback: (user: User) => void
  ): Promise<void> {
    // How to implement: Use node-fetch to fetch users from the API, iterate through them and call the callback
    // with each and every user.
    const response: User[] = await this.get("/users");
    response.forEach((user) => callback(user));
  }
}

// A couple of convenience functions you can use to create unique entity ids.
const getUserId = (user: User) => `user:${user.id}`;
const getPostId = (post: Post) => `post:${post.id}`;

(async () => {
  // Use methods provided in the Graph class to create a graph that has the following entities:
  // - Users
  // - Posts
  // And the following relationships:
  // - User has Post
  const graph = new Graph();

  const postsApi = new PostsApi("https://jsonplaceholder.typicode.com");
  const usersApi = new UsersApi("https://jsonplaceholder.typicode.com");

  // How to implement: following the code above, turn users into entities
  await usersApi.iterateUsers(async (user: User) => {
    graph.createEntity(getUserId(user), "User", user);
  });

  // How to implement: following the code above, turn posts into entities
  await postsApi.iteratePosts(async (post: Post) => {
    // After creating posts entities, build the relationships between posts and the (owner) users
    const postEntity = graph.createEntity(getPostId(post), "Post", post);
    const userEntity = graph.findEntityById(`user:${post.userId}`);
    if (userEntity && postEntity){
      graph.createRelationship(userEntity, postEntity, "HAS");
    }
  });

  // *** TESTS, don't touch ***
  const test = new Test();
  await test.run(graph);
})();