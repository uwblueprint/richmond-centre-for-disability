import { Button, Text } from '@chakra-ui/react';
import { SyntheticEvent, useRef } from 'react';

//TODO: rename this better??
export default function FileUpload() {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const fileUploaded = (target.files as FileList)[0];
    // props.handleFile(fileUploaded);
  };

  return (
    <>
      <Button bg="primary" onClick={handleFileUpload}>
        <Text textStyle="button-semibold">Click to add attachment</Text>
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
