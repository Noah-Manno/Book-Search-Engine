const { User, Book } = require('../models');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (parent, { username }) => {
      return await User.findOne({ username });
    },
    books: async (parent, { username }) => {
      if (username) {
        return await Book.find({ username });
      } else {
        return await Book.find();
      }
    },
    book: async (parent, { bookId }) => {
      return await Book.findOne({ bookId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      } else {
        throw new Error('You are not authenticated!');
      }
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = new User({ username, email, password });
      await user.save();
      return user;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const book = new Book({ ...input, username: context.user.username });
        await book.save();
        const user = await User.findByIdAndUpdate(context.user._id, { $push: { savedBooks: book } }, { new: true });
        return user;
      } else {
        throw new Error('You are not authenticated!');
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        await Book.findOneAndDelete({ bookId });
        const user = await User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
        return user;
      } else {
        throw new Error('You are not authenticated!');
      }
    },
  },
};

module.exports = resolvers;