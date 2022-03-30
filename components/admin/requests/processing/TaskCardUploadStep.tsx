import { SyntheticEvent, useRef, useState, FC } from 'react';
import { WarningTwoIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Text, Link, HStack, VStack, IconButton } from '@chakra-ui/react';

// 5 MB file size limit
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// File upload button props
type Props = {
  file: File | null; // currently uploaded file
  onUploadFile: (selectedFile: File) => void; // handle file upload
  readonly isDisabled: boolean;
  onUndo: () => void;
};

/**
 * POA form upload component allowing users to upload POA form PDF file
 */
export const TaskCardUploadStep: FC<Props> = ({ isDisabled, file, onUploadFile, onUndo }) => {
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
    const target = event.target as HTMLInputElement;
    const uploadedFile = (target.files as FileList)[0] || null;

    if (!uploadedFile) {
      return;
    }

    setErrorMessage(null);

    // Verify that uploaded file is < 5MB
    if (uploadedFile && uploadedFile.size > FILE_SIZE_LIMIT) {
      setErrorMessage('File exceeds maximum size');
    }
    onUploadFile(uploadedFile);
  };
  return (
    <>
      {file ? (
        errorMessage ? (
          <VStack align="flex-start" spacing="8px">
            <HStack>
              <WarningTwoIcon color="secondary.critical" />
              <Text textStyle="caption" color="text.critical">
                {file.name}
              </Text>
            </HStack>
            <Text textStyle="caption" color="text.critical">
              {errorMessage}
            </Text>
          </VStack>
        ) : (
          <>
            <VStack align="flex-start">
              <HStack>
                <Link
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  textStyle="caption"
                  color="primary"
                  textDecoration="underline"
                >
                  {file.name}
                </Link>
                <IconButton
                  aria-label="undo"
                  variant="ghost"
                  size={'xs'}
                  icon={<CloseIcon boxSize={'0.5em'} />}
                  onClick={onUndo}
                />
              </HStack>
            </VStack>
          </>
        )
      ) : (
        <>
          <Button
            marginLeft="auto"
            height="35px"
            bg="background.gray"
            _hover={isDisabled ? undefined : { bg: 'background.grayHover' }}
            color="black"
            disabled={isDisabled}
            onClick={handleClick}
          >
            <Text textStyle="xsmall-medium">Upload document</Text>
          </Button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: 'none' }}
            accept=".pdf"
          />
        </>
      )}
    </>
  );
};

export default TaskCardUploadStep;
