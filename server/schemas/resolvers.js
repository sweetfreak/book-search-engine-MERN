const {AuthenticationError } = require('apollo-server-express');
const {Book, User} = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    //getSingleUser, createUser,login, saveBook, deleteBook
    Query: {
        //get me
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('books');
      
              return userData;
            }
      
            throw new AuthenticationError('Not logged in');
        },    
        //single user
        // user: async (parent, {username}) => {
        //     return user.findOne({username})
        //         .select('-__v -password')
        //         .populate('books');
        // }
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};

        },
        saveBook: async(parent, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookId } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');

        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user.id},
                    { $pull: {savedBooks: bookId}},
                    {new: true}
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');

        }

    }
}

module.exports = resolvers;