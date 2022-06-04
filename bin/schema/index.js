const typeDefs = [`
  type Query {
    post(_id: String): Post
    posts: [Post]
    comment(_id: String): Comment
  }

  scalar Date

  type Post {
    _id: String
    postId : String
    title: String
    content: String
    author : String
    createdDate : Date
    lastUpdate : Date
    comments: [Comment]
  }

  type Comment {
    _id: String
    commentId: String
    content: String
    author : String
    createdDate : Date
    lastUpdate : Date
    post: Post
  }

  type DeletePost {
    _id : String
    postId : String
  }

  type DeleteComment {
    _id : String
    postId : String
  }

  type UpdatePost {
    postId : String
    title: String
    content: String
    author : String
    lastUpdate : Date
  }

  type UpdateComment{
    commentId : String
    content: String
    author : String
    lastUpdate : Date
  }

  type Mutation {
    createPost( postId : String, title: String, content: String, author: String): Post
    createComment( commentId: String, content: String, author: String): Comment
    deleteOnePost(postId: String): DeletePost
    deleteOneComment(postId: String): DeleteComment
    updateOnePost(postId: String, title: String, content: String, author: String) : UpdatePost
    updateOneComment(commentId: String, content: String, author: String) : UpdatePost
  }

  schema {
    query: Query
    mutation: Mutation
  }
`];

module.exports = {
  typeDefs
};
