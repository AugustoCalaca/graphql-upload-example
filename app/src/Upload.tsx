import { useMutation, gql } from "@apollo/client";
import React from "react";

const SINGLE_UPLOAD = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      filename
      encoding
      mimetype
    }
  }
`;

const Upload = () => {
  const [singleUpload] = useMutation(SINGLE_UPLOAD, {
    onCompleted: (data) => console.log({ data }),
    onError: (err) => console.log({ err }),
  });
  const handleSingleUpload = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target.files[0];
    console.log({ file });
    const isValid = target.validity.valid;
    console.log({ isValid });
    isValid && singleUpload({ variables: { file } });
  };

  return <input type="file" onChange={handleSingleUpload} />;
};

export default Upload;
