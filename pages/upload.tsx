import { useState } from 'react';
import { useS3Upload } from 'next-s3-upload';

export default function UploadTest() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [key, setKey] = useState<string>();

  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const handleFileChange = async (file: File) => {
    const { url, key } = await uploadToS3(file);
    setImageUrl(url);
    setKey(key);
  };

  return (
    <div>
      <FileInput onChange={handleFileChange} />

      <button onClick={openFileDialog}>Upload file</button>

      <p>{imageUrl}</p>
      <p>{key}</p>
    </div>
  );
}
