// src/components/editor/MarkdownEditor.tsx
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Start writing your story...' 
}: MarkdownEditorProps) {
  const options = useMemo(() => ({
    placeholder: placeholder,
    spellChecker: false,
    status: ['autosave', 'lines', 'words', 'cursor'],
    autosave: {
      enabled: true,
      delay: 1000,
      uniqueId: 'rwanda-editor',
    },
  }), [placeholder]);

  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={options}
    />
  );
}