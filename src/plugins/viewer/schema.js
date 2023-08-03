export const ViewerSchema = {
    title: 'Viewer edit',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['code', 'fontsize'],
      },
    ],
    properties: {
      fontsize: {
        title: 'Font Size',
        description: 'The font size in px',
        widget: 'text',
      },
      code: {
        title: 'Code',
        description: 'The code you want to show',
        widget: 'textarea',
      },
    },
    required: ['code'],
  };
  