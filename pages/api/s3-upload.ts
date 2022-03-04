import { APIRoute } from 'next-s3-upload';
import { getToken } from 'next-auth/jwt';
import { NextApiHandler } from 'next';

// Folder structure in s3 can be in the configure if needed
// see https://next-s3-upload.codingvalue.com/s3-file-paths
const uploadHandler = APIRoute.configure({});
const jwtSecret = process.env.NA_JWT_SECRET;

/**
 * Auth wrapper for next-s3-upload API Route
 * https://next-s3-upload.codingvalue.com
 */
const s3UploadHandler: NextApiHandler = async (req, res) => {
  const token = await getToken({ req: req, secret: jwtSecret });
  if (token) {
    // Signed in
    await uploadHandler(req, res);
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};

export default s3UploadHandler;
