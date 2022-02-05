import { AttachmentIcon } from '@chakra-ui/icons';
import { Button, Text } from '@chakra-ui/react';
import { SyntheticEvent, useRef } from 'react';

type FileUploadProps = {
  currentFile: File;
  onUploadFile: (selectedFile: File) => void;
};

//TODO: rename this better??
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
    props.onUploadFile(fileUploaded);
  };

  return (
    <>
      <Button bg="primary" onClick={handleFileUpload} leftIcon={<AttachmentIcon />}>
        <Text textStyle="button-semibold">
          Click to {props.currentFile ? 'replace' : 'add'} attachment
        </Text>
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
