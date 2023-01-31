const blogsSchema = require("../Schemas/Blogs");
const constants = require("../constants");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDateTime;
  constructor({ title, textBody, userId, creationDateTime }) {
    this.textBody = textBody;
    this.title = title;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
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
              data: [
                { $skip: parseInt(skip) },
                { $limit: constants.BLOGSLIMIT },
              ],
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
              data: [
                { $skip: parseInt(skip) },
                { $limit: constants.BLOGSLIMIT },
              ],
            },
          },
        ]);

        resolve(myblogsDb);
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = Blogs;
