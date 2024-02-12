import { Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};
type Props = {
  onChange: (file: File) => void;
};
function UploadFile({ onChange }: Props) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'application/json': ['.json'],
    },
  } as unknown as DropzoneOptions);
  useEffect(() => {
    if (!isEmpty(acceptedFiles)) {
      onChange(acceptedFiles?.[0]);
    }
  }, [acceptedFiles]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const files = acceptedFiles.map((file) => (
    <li key={(file as any).path}>{(file as any).path}</li>
  ));

  return (
    <section className="container">
      <Box {...getRootProps({ sx: style })}>
        <input {...getInputProps()} type="file" />
        <p>Drag and drop some files here, or click to select files</p>
      </Box>
      {!isEmpty(files) && (
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  );
}
export default UploadFile;
