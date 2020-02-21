import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

// Create query definition and resolver for each
//
// title - string product name
// price - number as float
// releaseYear - number as int (optional)
// rating - number as float (optional)
// inStock - boolean


// Type definitions { schema }
// What are data looks like
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers
// functions
const resolvers = {
    Query: {
        title() {
            return "the war of Art"
        },
        price() {
            return 12.99
        },
        releaseYear() {
            return 2020
        },
        rating() {
            return 5
        },
        inStock() {
            return true
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start((e) => {
    console.log(`wow - The server is up!`, { e });
})

