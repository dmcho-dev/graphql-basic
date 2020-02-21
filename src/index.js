import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Create Custom Type
// User
// Post

// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
// functions
const resolvers = {
    Query: {
        me() {
            return {
                id: "123123",
                name: "Mike",
                email: "sample@gmail.com",
                age: 29
            }
        },
        post() {
            return {
                id: 'asd123',
                title: 'title Sample',
                body: 'body Sample',
                published: true,
            }
        }
    }
}

/**
 * Test Code
```
query{
  me {
    id
    name
    email
    age
  }
  post {
    id
    title
    body
    published
  }
}
```
 */

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start((e) => {
    console.log(`wow - The server is up!`, { e });
})

