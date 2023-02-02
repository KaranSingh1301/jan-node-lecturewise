const express = require("express");
const BlogsRouter = express.Router();
const Blogs = require("../Models/Blogs");
const User = require("../Models/User");
const BlogsDataValidate = require("../utils/BlogsUtils");

BlogsRouter.post("/create-blog", (req, res) => {
  const title = req.body.title;
  const textBody = req.body.textBody;
  const userId = req.session.user.userId;
  const creationDateTime = new Date();

  //data cleaning
  BlogsDataValidate({ title, textBody, userId })
    .then(async () => {
      try {
        await User.verifyUserId({ userId });

        //create a blog
        const blog = new Blogs({ title, textBody, userId, creationDateTime });

        try {
          const blogDb = await blog.createBlog();

          return res.send({
            status: 200,
            message: "Blog created successfully",
            data: blogDb,
          });
        } catch (err) {
          return res.send({
            status: 402,
            message: "Error Occurred",
            error: err,
          });
        }
      } catch (error) {
        console.log(error);
        return res.send({
          status: 402,
          message: "Error Occurred",
          error: error,
        });
      }

      return res.send(true);
    })
    .catch((error) => {
      return res.send({
        status: 401,
        message: "Error occured",
        error: error,
      });
    });
});

BlogsRouter.get("/get-blogs", async (req, res) => {
  const skip = req.query.skip || 0;

  try {
    const blogsDb = await Blogs.getBlogs({ skip });

    return res.send({
      status: 200,
      message: "Read successfull",
      data: blogsDb,
    });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Read unsuccessfull",
      error: err,
    });
  }
});

BlogsRouter.get("/my-blogs", async (req, res) => {
  const userId = req.session.user.userId;
  const skip = req.query.skip || 0;

  try {
    const myBlogsDb = await Blogs.getMyBlogs({ skip, userId });
    return res.send({
      status: 200,
      message: "Read successfull",
      data: myBlogsDb,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 400,
      message: "Read unsuccessfull",
      error: err,
    });
  }
});

BlogsRouter.post("/edit-blog", async (req, res) => {
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  //data validation

  if (!title && !textBody) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  try {
    const blog = new Blogs({ blogId, title, textBody });
    //write a function to find the blog
    const blogDb = await blog.getDataofBlogFromId();

    console.log(blogDb);

    //validate the blog owner with the userId from the session
    // if(blogDb.userId.toString() !== userId.toString())
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 401,
        message: "Not allow to edit.",
      });
    }

    //put the check to allow only to edit within 30 mins from creation

    const currentDateTime = Date.now();
    const creationDateTime = new Date(blogDb.creationDateTime); // string ---> date obj

    // console.log(currentDateTime);
    //console.log(creationDateTime.getMinutes());

    const diff = (currentDateTime - creationDateTime.getTime()) / (1000 * 60);
    console.log(diff);

    if (diff > 30) {
      return res.send({
        status: 403,
        message: "Edit Unsuccessfull",
        error: "Can not edit after 30 mins of creation",
      });
    }

    //everyting is fine so update the blog

    try {
      const oldBlog = await blog.updateBlog();
      return res.send({
        status: 200,
        message: "Edit Successfully",
        data: oldBlog,
      });
    } catch (error) {
      return res.send({
        status: 401,
        message: "Error Occured",
        error: err,
      });
    }
  } catch (error) {
    return res.send({
      status: 402,
      message: "Error Occured",
      error: err,
    });
  }
});

BlogsRouter.post("/delete-blog", async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    //get the blog with blogId
    const blog = new Blogs({ blogId });
    const blogDb = await blog.getDataofBlogFromId();

    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 401,
        message: "Not allow to Delete. Authrization Failed",
      });
    }

    //delete the blog

    const blogData = await blog.deleteBlog();

    return res.send({
      status: 200,
      message: "Delete Successfull",
      data: blogData,
    });
  } catch (error) {
    return res.send({
      status: 401,
      message: "error occurred",
      error: error,
    });
  }
});

module.exports = BlogsRouter;

//client ---> (userid, title, etxtbody, blogId) ---> server
