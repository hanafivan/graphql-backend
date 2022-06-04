const {makeExecutableSchema} = require('@graphql-tools/schema');
const {typeDefs} = require('../schema');
const {MongoClient, ObjectId} = require('mongodb');
const config = require('../config');
const mongoDbUrl = config.get('/mongoDbUrl');
const uuid = require('uuid');
const init = async () => {
  const db = await MongoClient.connect(mongoDbUrl);
  const Posts = db.collection('posts');
  const Comments = db.collection('comments');

  const beautify = (o) => {
    o._id = o._id.toString()
    return o
  };

  const resolvers = {
    Query: {
      post: async (root, {_id}) => {
        return beautify(await Posts.findOne(ObjectId(_id)));
      },
      posts: async () => {
        return (await Posts.find({}).toArray()).map(beautify);
      },
      comment: async (root, {_id}) => {
        return beautify(await Comments.findOne(ObjectId(_id)));
      },
    },
    Post: {
      comments: async ({_id}) => {
        return (await Comments.find({postId: _id}).toArray()).map(beautify);
      }
    },
    Comment: {
      post: async ({postId}) => {
        return beautify(await Posts.findOne(ObjectId(postId)));
      }
    },
    Mutation: {
      createPost: async (root, args, context, info) => {
        args.createdDate = new Date().toISOString();
        args.lastUpdate = new Date().toISOString();
        args.postId = uuid.v4();
        const res = await Posts.insertOne(args);
        return beautify(res.ops[0]);
      },
      createComment: async (root, args) => {
        args.createdDate = new Date().toISOString();
        args.lastUpdate = new Date().toISOString();
        const res = await Comments.insert(args);
        return beautify(await Comments.findOne({_id: res.commentId[1]}));
      },
      deleteOnePost: async (root, args) => {
        console.log(args)
        const res = await Posts.deleteOne(args);
        return res.deletedCount;
      },
      deleteOneComment: async (root, args) => {
        console.log(args)
        const res = await Comment.deleteOne(args);
        return res.deletedCount;
      },
      updateOnePost: async (root, args) => {
        const res = await Posts.update(
          {postId : args.postId},
          {
            $set: {
              title: args.title,
              content: args.content,
              author: args.author,
              lastModified : new Date().toISOString()
            }
          },
          { upsert: true });
        return res;
      },
      updateOneComment: async (root, args) => {
        const res = await Comment.update(
          {postId : args.commentId},
          {
            $set: {
              content: args.content,
              author: args.author,
              lastModified : new Date().toISOString()
            }
          },
          { upsert: true });
        return res;
      },
    },
  };


  const schema = {
    schema : makeExecutableSchema({
      typeDefs,
      resolvers
    })
  };
  return schema;
}

module.exports = {
  init
};