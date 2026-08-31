'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback } from 'react'

interface MicroEditorProps {
  content: string
  onChange: (html: string) => void
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        minWidth: '34px',
        height: '34px',
        padding: '0 9px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: active ? '#111827' : 'transparent',
        color: active ? '#fff' : '#6b7280',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}

export default function MicroEditor({ content, onChange }: MicroEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, code: false, codeBlock: false, horizontalRule: false }),
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder: 'Ne düşünüyorsun?' }),
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    editorProps: {
      attributes: {
        style: 'min-height:120px;outline:none;font-size:16px;line-height:26px;color:#1b1c1c;font-family:inherit',
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Link URL:', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '8px 10px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa',
      }}>
        <ToolbarBtn
          title="Kalın (Ctrl+B)"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          title="İtalik (Ctrl+I)"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarBtn>
        <div style={{ width: '1px', height: '18px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />
        <ToolbarBtn
          title="Link ekle"
          active={editor.isActive('link')}
          onClick={setLink}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolbarBtn>
        {editor.isActive('link') && (
          <ToolbarBtn
            title="Linki kaldır"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d00202" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m12.728 0L5.636 18.364" />
            </svg>
          </ToolbarBtn>
        )}
      </div>

      {/* Editor */}
      <div style={{ padding: '12px 14px' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap p { margin: 0 0 6px; }
        .tiptap p:last-child { margin-bottom: 0; }
        .tiptap a { color: #d00202; text-decoration: none; }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  )
}
