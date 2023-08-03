import React from 'react';
import config from '@plone/volto/registry';
import { Popup, PopupContent } from 'semantic-ui-react';
import { useEditorContext } from '@plone/volto-slate/hooks';
import ErrorBoundary from './ErrorBoundary';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
export const ViewerElement = ({ attributes, children, element, mode }) => {
  const { views } = config.widgets;
  const { data = {} } = element;
  const id = data?.viewer || data?.id;
  // console.log(id);
  // Get data from the editor, if it exists. The editor has up to date block
  // props
  const editor = useEditorContext();

  let output;
  let Widget = views.getWidget(data);

  // If edit mode and output is empty render it's id
  if (editor && !output) {
    output = data.code;
    Widget = views.getWidget({ widget: 'default' });
  }
  console.log(JSON.stringify(element));
  return (
    <>
      {mode === 'view' ? (
        <ErrorBoundary name={id}>
          <SyntaxHighlighter language="javascript" style={docco}>
            {element.data.code}
          </SyntaxHighlighter>
          {/* <pre
            style={{
              fontSize: `${element.data.fontsize}px`,
              backgroundColor: 'black',
              color: 'white',
              padding: '10px',
              lineHeight: `${element.data.fontsize}px`,
            }}
          >
            <code>{element.data.code}</code>
          </pre> */}
        </ErrorBoundary>
      ) : (
        <Popup
          wide="very"
          position="right center"
          trigger={
            <span {...attributes} className="metadata mention edit">
              {children}
            </span>
          }
        >
          <PopupContent>
            <ErrorBoundary name={id}>
              <Widget value={output} />
            </ErrorBoundary>
          </PopupContent>
        </Popup>
      )}
    </>
  );
};
