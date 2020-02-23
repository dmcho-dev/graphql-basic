import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4'
import uuid from 'uuid';

// 26. The Object Spread Operator with Node.js


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
        post: '10',
        text: "This worked well for me. thanks!"
    },
    {
        id: '103',
        author: '1',
        post: '10',
        text: "Glad This worked well for me. thanks!"
    },
    {
        id: '104',
        author: '2',
        post: '20',
        text: "This did no work."
    },
    {
        id: '105',
        author: '1',
        post: '30',
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


    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!

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
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.post === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user=> {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find(post => {
                return post.id === parent.post
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
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.email)
            if(emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                ...args
            }
            
            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author)
            if(!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args
            }
            console.log({args, userExists, post})

            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author)
            const postExists = posts.some(post => post.id === args.post && post.published)
            
            if(!userExists || !postExists) {
                throw new Error('Unable to find user and post')
            }

            const comment = {
                id: uuidv4(),
                ...args
            }

            comments.push(comment)
            return comment

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

