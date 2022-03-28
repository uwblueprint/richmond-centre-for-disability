import S3, { Body } from 'aws-sdk/clients/s3';
import { S3UploadedObject } from '@tools/types';
import mime from 'mime-types';

/**
 * Helper function for server side file uploads to s3.
 * ** NOTE: This should only be called on the server side for security purposes **
 * @param body Body to upload
 * @param key File path of object in s3 bucket e.g invoices/.../invoice_1.pdf.
 * @returns promise of an object with url, bucket and key
 */
export const serverUploadToS3 = async (
  body: Body,
  objectKey: string
): Promise<S3UploadedObject> => {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
    region: process.env.S3_UPLOAD_REGION as string,
  });

  const contentType = mime.lookup(objectKey);
  if (!contentType) {
    // Should really never happen.
    throw Error(`Bad content type for ${objectKey}`);
  }

  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET as string,
    Key: objectKey,
    Body: body,
    ContentType: contentType,
  };

  const uploadResult = await s3.upload(params).promise();

  return {
    url: uploadResult.Location,
    bucket: uploadResult.Bucket,
    key: uploadResult.Key,
  };
};

/**
 * Helper function for client side file uploads to s3.
 * This function will call the api/s3-upload backend endpoint to generate temporary keys and use those for the upload.
 * Adapted from https://github.com/ryanto/next-s3-upload/blob/master/packages/next-s3-upload/src/hooks/use-s3-upload.tsx
 * @param file File to upload
 * @param filePath Target directory of file without an ending "/"
 * @returns object with url, bucket and key
 */
export const clientUploadToS3 = async (file: File, filePath: string): Promise<S3UploadedObject> => {
  const filename = encodeURIComponent(file.name);
  // call backend to generate temporary/limited s3 upload keys
  const res = await fetch(`/api/s3-upload?filename=${filename}&filePath=${filePath}`);
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

/**
 * Create a signed URL for the purpose of accessing s3 object.
 * By default, bucket objects should be private so they will only be accessible with this link.
 * ** NOTE: This should only be called on the server side for security purposes **
 * @param objectKey
 * @param duration Optional: How long the URL should be good for.
 * @returns
 */
export const getSignedUrlForS3 = (objectKey: string, duration?: number): string => {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
    region: process.env.S3_UPLOAD_REGION,
  });

  const MAX_DURATION = 604800; // 1 week
  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: objectKey,
    Expires: duration || MAX_DURATION,
  };

  const url = s3.getSignedUrl('getObject', params);
  return url;
};
