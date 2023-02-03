const cron = require("node-cron");
const blogsSchema = require("./Schemas/Blogs");

function cleanUpBin() {
  cron.schedule("* 1 * * *", async () => {
    //find all the blogs where isDeleted === true

    const blogsDb = await blogsSchema.aggregate([
      { $match: { isDeleted: true } },
    ]);
    console.log(blogsDb);
    if (blogsDb) {
      blogsDb.forEach(async (blog) => {
        const deletionDateTime = new Date(blog.deletionDateTime).getTime();
        const currentDateTime = Date.now();
        const diff =
          (currentDateTime - deletionDateTime) / (1000 * 60 * 60 * 24);
        console.log(diff);
        if (diff >= 30) {
          console.log(diff);
          await blogsSchema.findOneAndDelete({ _id: blog._id });
          console.log(`Blog has been deleted : ${blog._id}`);
        }
      });
    }
  });
}

module.exports = { cleanUpBin };
