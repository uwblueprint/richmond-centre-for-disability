import { SyntheticEvent, useRef, useState, FC } from 'react';
import { AttachmentIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Button, Text, Box, Link, HStack, VStack } from '@chakra-ui/react';

// 5 MB file size limit
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// File upload button props
type Props = {
  file: File | null; // currently uploaded file
  onUploadFile: (selectedFile: File) => void; // handle file upload
};

/**
 * POA form upload component allowing users to upload POA form PDF file
 */
export const PoaFormUploadField: FC<Props> = ({ file, onUploadFile }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>('error');

  /**
   * Handle upload button click
   */
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  /**
   * Handle file selection
   */
  const handleChange = (event: SyntheticEvent) => {
    setErrorMessage(null);

    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0] || null;

    // Verify that uploaded file is < 5MB
    if (file && file.size > FILE_SIZE_LIMIT) {
      setErrorMessage('File exceeds maximum size');
    }

    onUploadFile(file);
  };

  return (
    <>
      <Text as="h3" textStyle="heading" paddingBottom="20px">
        {'Upload POA File'}
      </Text>
      <Text color="text.secondary">
        {'Only ONE file can be added. Files must be .pdf and can be a maximum of 5MB in size.'}{' '}
      </Text>
      {file && (
        <>
          <Text as="h4" textStyle="button-semibold" mt="24px">
            Current File
          </Text>
          <Box mt="8px">
            {errorMessage ? (
              <VStack align="flex-start" spacing="8px">
                <HStack>
                  <WarningTwoIcon color="secondary.critical" />
                  <Text textStyle="body-regular" color="text.critical">
                    {file.name}
                  </Text>
                </HStack>
                <Text textStyle="caption" color="text.critical">
                  {errorMessage}
                </Text>
              </VStack>
            ) : (
              <Link
                href={URL.createObjectURL(file)}
                download={file.name}
                textStyle="body-regular"
                color="primary"
                textDecoration="underline"
              >
                {file.name}
              </Link>
            )}
          </Box>
        </>
      )}
      <Button variant="solid" marginTop="20px" onClick={handleClick} leftIcon={<AttachmentIcon />}>
        Click to {file ? 'replace' : 'add'} attachment
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept=".pdf"
      />
    </>
  );
};

export default PoaFormUploadField;
