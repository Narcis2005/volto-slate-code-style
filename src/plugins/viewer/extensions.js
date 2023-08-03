import { VIEWER } from './constants';

export const withViewer = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === VIEWER ? true : isInline(element);
  };

  return editor;
};
