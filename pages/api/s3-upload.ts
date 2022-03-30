import { APIRoute } from 'next-s3-upload';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

// Configure folder structure
// see https://next-s3-upload.codingvalue.com/s3-file-paths
const uploadHandler = APIRoute.configure({
  key(req, filename) {
    const filePath = req.query.filePath as string;
    return `${filePath}/${filename.replace(/\s/g, '-')}`;
  },
});

/**
 * Auth wrapper for next-s3-upload API Route
 * https://next-s3-upload.codingvalue.com
 */
const s3UploadHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    // Signed in
    await uploadHandler(req, res);
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};

export default s3UploadHandler;
