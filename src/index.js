import { GraphQLServer } from 'graphql-yoga';


// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`


// Resolvers
// functions
const resolvers = {
    Query: {
        hello() {
            return `This is my first query`;
        },
        name() {
            return 'Dongmin Cho';
        },
        location() {
            return 'Seoul / Korea';
        },
        bio() {
            return 'I study in Blah blah blah'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log(`The server is up!`);
})
