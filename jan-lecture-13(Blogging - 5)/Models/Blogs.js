const blogsSchema = require("../Schemas/Blogs");
const constants = require("../constants");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  blogId;
  title;
  textBody;
  userId;
  creationDateTime;
  constructor({ title, textBody, userId, creationDateTime, blogId }) {
    this.textBody = textBody;
    this.title = title;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
    this.blogId = blogId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.textBody.trim();
      this.textBody.trim();

      const blog = new blogsSchema({
        title: this.title,
        textBody: this.textBody,
        userId: this.userId,
        creationDateTime: this.creationDateTime,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBlogs({ skip }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogsDb = await blogsSchema.aggregate([
          //pagination , sort
          { $sort: { creationDateTime: -1 } },
          {
            $facet: {
              data: [{ $skip: parseInt(skip) }, { $limit: constants.LIMIT }],
            },
          },
        ]);

        resolve(blogsDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getMyBlogs({ skip, userId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const myblogsDb = await blogsSchema.aggregate([
          { $match: { userId: ObjectId(userId) } },
          { $sort: { creationDateTime: -1 } },
          {
            $facet: {
              data: [{ $skip: parseInt(skip) }, { $limit: constants.LIMIT }],
            },
          },
        ]);

        resolve(myblogsDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  getDataofBlogFromId() {
    return new Promise(async (resolve, reject) => {
      try {
        const blogDb = await blogsSchema.findOne({
          _id: ObjectId(this.blogId),
        });
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBlog() {
    return new Promise(async (resolve, reject) => {
      try {
        let newBlogData = {};
        if (this.title) {
          newBlogData.title = this.title;
        }

        if (this.textBody) {
          newBlogData.textBody = this.textBody;
        }

        const oldData = await blogsSchema.findOneAndUpdate(
          { _id: ObjectId(this.blogId) },
          newBlogData
        );
        return resolve(oldData);
      } catch (error) {
        return reject(error);
      }
    });
  }

  deleteBlog() {
    return new Promise(async (resolve, reject) => {
      try {
        const blogData = await blogsSchema.findOneAndDelete({
          _id: ObjectId(this.blogId),
        });
        resolve(blogData);
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = Blogs;
