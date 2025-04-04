import S3, { Body } from 'aws-sdk/clients/s3';
import { S3UploadedObject } from '@tools/types';
import mime from 'mime-types';

/**
 * Helper function for server side file uploads to s3.
 * ** NOTE: This should only be called on the server side for security purposes **
 * @param body Body to upload
 * @param objectKey File path of object in s3 bucket e.g invoices/.../invoice_1.pdf.
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
 * @param duration How long the URL should be valid for (in seconds). If not specified, defaults to the max duration of 7 days.
 * @param autoDownload If the file should be automatically downloaded when the link is clicked
 * @returns
 */
export const getSignedUrlForS3 = (
  objectKey: string,
  duration?: number,
  autoDownload?: boolean
): string => {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
    region: process.env.S3_UPLOAD_REGION,
  });

  const MAX_DURATION = 604800; // 7 days
  let expires = MAX_DURATION;
  if (duration && duration > 0 && duration < MAX_DURATION) {
    expires = duration;
  }
  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: objectKey,
    Expires: expires,
    ResponseContentDisposition: autoDownload ? 'attachment' : 'inline',
  };

  const url = s3.getSignedUrl('getObject', params);
  return url;
};

/**
 * Get the file name of a file stored in S3 from its object key
 * @param objectKey S3 object key
 * @returns name of file stored in S3
 */
export const getFileName = (objectKey: string): string | undefined => {
  return objectKey.split('/').at(-1);
};

/**
 * Update S3SignedUrl for expired S3 Object Key
 * @param objectKey S3 object key
 * @param s3SignedUrl Current S3 Signed Url (possibly expired)
 * @param lastUpdatedTime Last updating time for Object Key (UTC)
 * @returns New a valid S3 Signed Url for Object Key
 */
export const refreshS3SignedUrl = (
  objectKey: string | null,
  s3SignedUrl: string | null,
  lastUpdatedTime: number
) => {
  // Get the valid duration period from env.
  const linkDuration = parseInt(process.env.INVOICE_LINK_TTL_DAYS);
  const DAY = 24 * 60 * 60 * 1000;
  const daysDifference = Math.floor(new Date().getTime() / DAY) - Math.floor(lastUpdatedTime / DAY);
  if (daysDifference > linkDuration) {
    s3SignedUrl = getSignedUrlForS3(objectKey as string);
  }
  return s3SignedUrl;
};
