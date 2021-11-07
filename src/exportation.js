const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./libs/s3Client.js");
const fs = require('fs');

// Set the parameters
const fileContent = fs.readFileSync(__dirname + "/descargasS3/db.csv");

const params = {
  Bucket: "tweets-ejemplos", // The name of the bucket. For example, 'sample_bucket_101'.
  Key: "db.csv", // The name of the object. For example, 'sample_upload.txt'.
  Body: fileContent, // The content of the object. For example, 'Hello world!".
};

const run = async () => {
  // Create an object and upload it to the Amazon S3 bucket.
  try {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
        "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();