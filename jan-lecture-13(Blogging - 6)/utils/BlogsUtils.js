function BlogsDataValidate({ title, textBody, userId }) {
  return new Promise((resolve, reject) => {
    if (!title || !textBody || !userId) {
      return reject("Missing credentials");
    }

    if (typeof title !== "string" || typeof textBody !== "string") {
      return reject("Invalid Data");
    }
    if (title.length > 100) {
      return reject("Title should be less than 100 charachters");
    }

    if (textBody.length > 1000) {
      return reject("TextBody should be less than 1000 charachters");
    }

    return resolve();
  });
}

module.exports = BlogsDataValidate;
