import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// 17. Working with Arrays: Part II


/**
 * 
1. Set up an array of three posts with dummy post data (id, title, body, published)
2. Set up a "posts" query and resolver that returns all the posts
3. Test the query out
4. Add a "query" argument that only returns posts that contain the query string in the title or body
5. run a few sample queries searching for posts with a specific title

 */


// Demo user data
const users = [
    {
        id: '1',
        name: 'Dongmin',
        email: 'dmcho@gmail.com',
        age: 37,
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'sarah@gmail.com',
        age: 27,
    },
]

const posts = [
    {
        id: '10',
        title: "Graphql 101",
        body: 'title alpha 1',
        published: true
    },
    {
        id: '20',
        title: "Graphql 201",
        body: 'title alpha 2',
        published: false
    },
    {
        id: '30',
        title: "Graphql 301",
        body: 'title alpha 3',
        published: false
    },
]

// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
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
        users(parent, args, ctx, info) {
            if(!args.query) {
                return users
            }


            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: "123123",
                name: "Mike",
                email: "sample@gmail.com",
                age: 29
            }
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })

            // const stringCompare = ( target, search ) => target.toLowerCase().includes(search.toLowerCase())
            // const filterOption = (item, query) => {
            //     return stringCompare(item.title, query) || stringCompare(item.body, query)
            // } 

            // return posts.filter((post) => filterOption(post, args.query))
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start((e) => {
    console.log(`wow - The server is up!`);
})

