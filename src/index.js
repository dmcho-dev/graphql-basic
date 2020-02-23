import { GraphQLServer } from 'graphql-yoga';
import db from './db'
import * as resolvers from './resolvers'

// 31. A Pro GraphQL Project Structure: Part II

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db,
    }

})

server.start((e) => {
    console.log(`wow - The server is up!`);
})

