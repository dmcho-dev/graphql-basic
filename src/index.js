import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4'

// 29. Deleting Data with Mutations: Part II


// Demo user data
let users = [
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

let posts = [
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

let comments = [
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
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!

    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
            const emailTaken = users.some(user => user.email === args.data.email)
            if(emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            
            users.push(user)
            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user=> user.id === args.id)
            if(userIndex === -1) {
                throw new Error('User not found')
            }

            const deleteUser = users.splice(userIndex, 1)
            posts = posts.filter(post => {
                const match = post.author === args.id
                
                if(match) {
                    comments = comments.filter(comment => comment.post !== post.id)
                }

                return !match
            })
            comments = comments.filter(comment => comment.author !== args.id)

            return deleteUser[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            if(!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)
            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post=> post.id === args.id)
            if(postIndex === -1) {
                throw new Error('Post not found')
            }

            const deletePost = posts.splice(postIndex, 1)
            
            comments = comments.filter(comment => comment.post !== args.id)

            return deletePost[0]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            const postExists = posts.some(post => post.id === args.data.post && post.published)
            
            if(!userExists || !postExists) {
                throw new Error('Unable to find user and post')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)
            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment=> comment.id === args.id)
            if(commentIndex === -1) {
                throw new Error('Comment not found')
            }

            const deleteComment = comments.splice(commentIndex, 1)

            return deleteComment[0]
        },
    }

}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start((e) => {
    console.log(`wow - The server is up!`);
})

