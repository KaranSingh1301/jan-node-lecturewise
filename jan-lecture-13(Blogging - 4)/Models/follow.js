const followSchema = require("../Schemas/Follow");

function followUser({ followerUserId, followingUserId }) {
  return new Promise(async (resolve, reject) => {
    //check if they follow entry exist
    try {
      const followObj = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followObj) {
        reject("User alredy follow");
      }

      //create a new entry
      const follow = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: new Date(),
      });

      try {
        const followDb = await follow.save();
        resolve(followDb);
      } catch (error) {
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { followUser };
