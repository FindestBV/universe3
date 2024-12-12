import React from 'react';
import { renderProseMirrorContent } from '../lib/renderProseMirror';

const TestComponent: React.FC = () => {
  const testData = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello, world!' },
          {
            type: 'text',
            text: 'Click here',
            marks: [
              {
                type: 'link',
                attrs: { href: 'https://findest.com', target: '_blank' },
              },
            ],
          },
        ],
      },
    ],
  };

  return <div>{renderProseMirrorContent(testData)}</div>;
};

export default TestComponent;
