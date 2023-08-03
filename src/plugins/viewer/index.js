// import React from 'react';
import { defineMessages } from 'react-intl';
import { VIEWER } from './constants';
import { ViewerElement } from './render';
import { withViewer } from './extensions';
import { ViewerSchema } from './schema';
import CodeViewerEditor from './CodeViewerEditor';
import ToolbarButton from './ToolbarButton';
import Troll from './troll.svg';
import mentionsSVG from '@plone/volto/icons/connector.svg';
import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { omit } from 'lodash';

// import './less/editor.less';
const messages = defineMessages({
  edit: {
    id: 'Edit viewer',
    defaultMessage: 'Edit viewer',
  },
  delete: {
    id: 'Remove viewer',
    defaultMessage: 'Remove viewer',
  },
});

const omittedProps = [
  'pluginEditor',
  'getActiveElement',
  'unwrapElement',
  'schemaProvider',
  'hasValue',
  'elementType',
  'isInlineElement',
  'editSchema',
  'element',
  'persistentHelper',
];

const btnFactory = (options) => (props) => (
  <ToolbarButton {...props} {...options} title="Viewer" />
);

export default (config) => {
  //   const SVGIcon = JSON.parse(JSON.stringify(await (await fetch(Troll)).text()));
  //   const SVGObject = {
  //     attributes: {
  //       height: '36',
  //       width: '36',
  //       xmlns: 'http://www.w3.org/2000/svg',
  //       viewBox: '0 0 36 36',
  //     },
  //     content: SVGIcon,
  //   };
  const opts = {
    title: 'Code Viewer',
    pluginId: VIEWER,
    pluginEditor: CodeViewerEditor,
    elementType: VIEWER,
    element: ViewerElement,
    isInlineElement: true,
    editSchema: ViewerSchema,
    extensions: [withViewer],
    hasValue: (formData) => !!(formData.code || formData.id),
    toolbarButtonIcon: mentionsSVG,
    messages,
  };
  const [installViewerEditor, , , pluginOptions] = makeInlineElementPlugin(
    opts,
  );
  config = installViewerEditor(config);

  const { slate } = config.settings;
  slate.toolbarButtons = [...(slate.toolbarButtons || []), VIEWER];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    VIEWER,
  ];

  // Custom viewer Toolbar Button
  slate.buttons[VIEWER] = btnFactory(omit(pluginOptions, omittedProps));

  return config;
};
