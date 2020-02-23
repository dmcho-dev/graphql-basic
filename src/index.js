import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// 18. Relational Data: Basics


/**

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
        published: true,
        author: '1'
    },
    {
        id: '20',
        title: "Graphql 201",
        body: 'title alpha 2',
        published: false,
        author: '1'
    },
    {
        id: '30',
        title: "Graphql 301",
        body: 'title alpha 3',
        published: false,
        author: '2'
    },
]

// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String, author: String): [Post!]!
        me: User!
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
        author: User!
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
    },
    Post: {
        author(parent, args, ctx, info) {
            console.log({parent})

            return users.find(user => {
                return user.id === parent.author
            })
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

