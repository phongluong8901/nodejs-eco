import React, { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({ label, value, changeValue, name, invalidFields, setInvalidFields }) => {
  return (
    <div className='flex flex-col gap-2'>
      <span className='font-semibold'>{label}</span>
      <Editor
        apiKey={process.env.REACT_APP_TINY}
        value={value} 
        init={{
          height: 500,
          menubar: true,
          // --- THÊM DÒNG NÀY ĐỂ LƯU TIẾNG VIỆT THUẦN ---
          entity_encoding: 'raw', 
          // --------------------------------------------
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={(content) => {
          changeValue(content); 
        }}
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {invalidFields?.some(el => el.name === name) && (
        <small className='text-main text-[10px] italic'>
          {invalidFields.find(el => el.name === name)?.mes}
        </small>
      )}
    </div>
  );
};

export default memo(MarkdownEditor);