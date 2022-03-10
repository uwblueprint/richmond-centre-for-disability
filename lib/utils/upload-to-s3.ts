import S3 from 'aws-sdk/clients/s3';

type UploadedObject = {
  url: string;
  bucket: string;
  key: string;
};

/**
 * Upload file to S3
 * Adapted from https://github.com/ryanto/next-s3-upload/blob/master/packages/next-s3-upload/src/hooks/use-s3-upload.tsx
 * @param file File to upload
 * @returns object with url, bucket and key
 */
export const uploadToS3 = async (file: File): Promise<UploadedObject> => {
  const filename = encodeURIComponent(file.name);
  // call backend to generate temporary/limited s3 upload keys
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

    return {
      url: uploadResult.Location,
      bucket: uploadResult.Bucket,
      key: uploadResult.Key,
    };
  }
};
