import { SyntheticEvent, useRef, useState, FC } from 'react';
import { WarningTwoIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Text, Link, HStack, VStack, IconButton, Box, Tooltip } from '@chakra-ui/react';
import { getFileName } from '@lib/utils/s3-utils';

// 5 MB file size limit
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// File upload button props
type Props = {
  readonly fileUrl: string | null; // currently uploaded file url
  readonly onUploadFile: (selectedFile: File) => void; // handle file upload
  readonly isDisabled: boolean;
  readonly onUndo: () => void;
};

/**
 * POA form upload component allowing users to upload POA form PDF file
 */
export const TaskCardUploadStep: FC<Props> = ({ isDisabled, fileUrl, onUploadFile, onUndo }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /**
   * Handle upload button click
   */
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  /** File name retrieved from s3 URL */
  const fileName = fileUrl ? getFileName(new URL(decodeURI(fileUrl)).pathname) : null;

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
      return;
    }
    onUploadFile(uploadedFile);
  };
  return (
    <>
      {fileUrl ? (
        <VStack align="flex-start">
          <HStack>
            {fileName ? (
              <Tooltip
                hasArrow
                closeOnClick={false}
                label="Clicking on this link will open the document in a new tab"
                placement="bottom"
                bg="background.grayHover"
                color="black"
              >
                <Link
                  href={fileUrl}
                  isExternal={true}
                  textStyle="caption"
                  color="primary"
                  textDecoration="underline"
                >
                  {fileName}
                </Link>
              </Tooltip>
            ) : null}
            <IconButton
              aria-label="undo"
              variant="ghost"
              size={'xs'}
              icon={<CloseIcon boxSize={'0.5em'} />}
              onClick={onUndo}
            />
          </HStack>
        </VStack>
      ) : (
        <Box align="end">
          <Button
            align="end"
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
        </Box>
      )}
      {errorMessage && (
        <>
          <HStack>
            <WarningTwoIcon color="secondary.critical" />
            <Text textStyle="caption" color="text.critical">
              {errorMessage}
            </Text>
          </HStack>
        </>
      )}
    </>
  );
};

export default TaskCardUploadStep;
