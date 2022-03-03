import S3 from 'aws-sdk/clients/s3';

export const uploadToS3 = async (file: File) => {
  const filename = encodeURIComponent(file.name);
  const res = await fetch(`/api/s3-upload?filename=${filename}`);
  const data = await res.json();

  if (data.error) {
    console.error(data.error);
    throw data.error;
  } else {
    const s3 = new S3({
      accessKeyId: data.token.Credentials.AccessKeyId,
      secretAccessKey: data.token.Credentials.SecretAccessKey,
      sessionToken: data.token.Credentials.SessionToken,
      region: data.region,
    });

    const params = {
      ACL: 'bucket-owner-full-control',
      Bucket: data.bucket,
      Key: data.key,
      Body: file,
      ContentType: file.type,
    };

    const uploadResult = await s3.upload(params).promise();

    // sign url example

    // try{
    //     var url = s3.getSignedUrl("getObject", {
    //         Bucket: data.bucket,
    //         Key: data.Key,
    //         Expires: 200 // seconds
    //     })
    //     console.log("PRESIGNED URL: ", url);
    // } catch (err) {
    //     console.log("SIGNING ERROR")
    //     console.log(err)
    //     throw err
    // }

    return {
      url: uploadResult.Location, // this URL can't really be used anywhere now
      bucket: uploadResult.Bucket,
      key: uploadResult.Key,
    };
  }
};
