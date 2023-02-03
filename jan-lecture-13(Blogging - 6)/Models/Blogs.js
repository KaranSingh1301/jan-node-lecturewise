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

  static getBlogs({ skip, followingUserIds }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogsDb = await blogsSchema.aggregate([
          //pagination , sort
          {
            $match: {
              userId: { $in: followingUserIds },
              isDeleted: { $ne: true },
            },
          },
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
          { $match: { userId: ObjectId(userId), isDeleted: { $ne: true } } },
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
        //Done previously
        // const blogData = await blogsSchema.findOneAndDelete({
        //   _id: ObjectId(this.blogId),
        // });

        const blogData = await blogsSchema.findOneAndUpdate(
          { _id: ObjectId(this.blogId) },
          { isDeleted: true, deletionDateTime: new Date() }
        );

        resolve(blogData);
      } catch (err) {
        reject(err);
      }
    });
  }
};

//blogs = 11
//test = 8
//test4 = 1
//test1=2

module.exports = Blogs;
