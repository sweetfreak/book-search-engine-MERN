const {gql} = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookId: String!): User
        removeBook(bookId: String!): User

    }

`;


// type Query {
//     me: User
//     user(username: String!): User
//     books(username: String): [Book]
//     book(bookId: String!): Book
// }

module.exports = typeDefs;