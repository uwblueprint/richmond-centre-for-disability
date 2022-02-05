import { AttachmentIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { SyntheticEvent, useRef } from 'react';

// File upload button props
type FileUploadProps = {
  currentFile: File | null; // currently uploaded file
  onUploadFile: (selectedFile: File) => void; // handle file upload
};

//TODO: rename this better??
/**
 * File upload button component allowing users to upload one file
 * @param props - props
 * @returns File upload button component allowing users to upload one file
 */
export default function FileUpload(props: FileUploadProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const fileUploaded = (target.files as FileList)[0];
    props.onUploadFile(fileUploaded ?? null);
  };

  return (
    <>
      <Button
        variant="solid"
        marginTop="20px"
        onClick={handleFileUpload}
        leftIcon={<AttachmentIcon />}
      >
        Click to {props.currentFile ? 'replace' : 'add'} attachment
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
