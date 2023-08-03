import { Icon as VoltoIcon, InlineForm } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { setPluginOptions } from '@plone/volto-slate/actions';
import { ViewerSchema } from './schema';
import { isEqual } from 'lodash';

export default (props) => {
  const {
    editor,
    pluginId,
    getActiveElement,
    isActiveElement,
    insertElement,
    unwrapElement,
    hasValue,
  } = props;

  const pid = `${editor.uid}-${pluginId}`;

  // Get formData
  // const context = useFormStateContext();
  // const { contextData, setContextData } = context;
  // const viewer = contextData.formData;
  const viewer = editor.getBlockProps
    ? editor.getBlockProps().code || editor.getBlockProps().properties
    : {};
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({});

  const active = getActiveElement(editor);
  const [elementNode] = active;
  const id = elementNode?.data?.code || elementNode?.data?.id;
  // console.log(viewer, id);

  // useEffect(() => {
  //   const data = elementNode.data
  //     ? {
  //         ...elementNode.data,
  //         [id]: viewer?.[id],
  //       }
  //     : {};
  //   setFormData(data);
  // }, [elementNode.data, id, viewer]);
  const isElement = isActiveElement(editor);
  const elRef = React.useRef(null);

  if (isElement && !isEqual(elementNode, elRef.current)) {
    elRef.current = elementNode;
    const data =
      elementNode.data != null && id
        ? {
            ...elementNode.data,
            [id]: viewer?.[id],
          }
        : {};
    // console.log(data);
    setFormData(data);
  } else if (!isElement) {
    elRef.current = null;
  }

  const saveDataToEditor = React.useCallback(
    (formData) => {
      const { onChangeField } = editor.getBlockProps
        ? editor.getBlockProps()
        : {}; // TODO: provide fake block props in volto-slate. onChangeField is onChange
      if (hasValue(formData)) {
        // hasValue(formData) = !!formData.footnote
        insertElement(editor, {
          fontsize: formData?.fontsize,
          code: formData?.code,
        });

        // Update document viewer
        onChangeField && onChangeField(formData?.code, formData?.code);
      } else {
        unwrapElement(editor);
      }
    },
    [
      editor,
      insertElement,
      unwrapElement,
      hasValue,
      // setContextData,
      // contextData,
      // viewer,
    ],
  );

  const onChangeValues = React.useCallback(
    (id, value) => {
      if (id == null) return;
      if (id === 'fontsize') {
        setFormData({
          ...formData,
          [id]: value,
          fontsize: value,
        });
      } else if (id === 'code') {
        setFormData({
          ...formData,
          [id]: value,
          code: value,
        });
      } else {
        setFormData({
          ...formData,
          [id]: value,
        });
      }
    },
    [formData],
  );
  // console.log(formData);
  const checkForCancel = () => {
    if (!id) {
      unwrapElement(editor);
    }
  };
  console.log(ViewerSchema);
  return (
    <InlineForm
      schema={ViewerSchema}
      title={ViewerSchema.title}
      icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
      onChangeField={(id, value) => {
        // console.log(id);
        onChangeValues(id, value);
      }}
      formData={formData}
      headerActions={
        <>
          <button
            onClick={() => {
              saveDataToEditor(formData);
              dispatch(setPluginOptions(pid, { show_sidebar_editor: false }));
              ReactEditor.focus(editor);
            }}
          >
            <VoltoIcon size="24px" name={checkSVG} />
          </button>
          <button
            onClick={() => {
              checkForCancel();
              dispatch(setPluginOptions(pid, { show_sidebar_editor: false }));
              setFormData({});
              ReactEditor.focus(editor);
            }}
          >
            <VoltoIcon size="24px" name={clearSVG} />
          </button>
        </>
      }
    />
  );
};
