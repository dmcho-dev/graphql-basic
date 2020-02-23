import { GraphQLServer } from 'graphql-yoga';

// 21. Comment Challenge: Part II


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
    {
        id: '3',
        name: 'Jack',
        email: 'jack@gmail.com',
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

const comments = [
    {
        id: '102',
        author: '3',
        text: "This worked well for me. thanks!"
    },
    {
        id: '103',
        author: '1',
        text: "Glad This worked well for me. thanks!"
    },
    {
        id: '104',
        author: '2',
        text: "This did no work."
    },
    {
        id: '105',
        author: '1',
        text: "wow"
    },
]

// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String, author: String): [Post!]!
        me: User!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]
        comments: [Comment!]!

    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
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
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    
    },
    Post: {
        author(parent, args, ctx, info) {
            console.log({parent})

            return users.find(user => {
                return user.id === parent.author
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user=> {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.author === parent.id
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

