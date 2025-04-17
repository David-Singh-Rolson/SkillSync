// import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const RichTextEditor = ({input, setInput,field}) => {

//     const handleChange = (content) => {
//       setInput({ ...input, [field]: content });
//     }
   
//   return <ReactQuill theme="snow" value={input.description} onChange={handleChange} />;
// }
// export default RichTextEditor

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ input, setInput, field }) => {
  const handleChange = (content) => {
    setInput({ ...input, [field]: content });
  };

  return (
    <ReactQuill
      theme="snow"
      value={input[field] || ''} // Make sure this doesn't start as undefined
      onChange={handleChange}
    />
  );
};

export default RichTextEditor;
