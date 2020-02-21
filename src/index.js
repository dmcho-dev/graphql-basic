import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// 16. Working with Arrays: Part I

// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
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
        greeting(parent, args, ctx, info) {
            console.log({parent, args, ctx})
            if(args.name && args.position) {
                return `Hello! ${args.name}! you are my favoriate ${args.position}`
            } else {
                return `Hello!`
            }
        },
        add(parent, args, ctx, info) {
            if(args.numbers.length === 0) {
                return 0
            }

            return args.numbers.reduce((accumulater, currentValue) => {
                return accumulater + currentValue
            })
        },
        grades(parent, args, ctx) {
            return [99, 80, 93]

        },
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
    console.log(`wow - The server is up!`);
})

