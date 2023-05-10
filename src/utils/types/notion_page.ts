export type NotionPage = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: {
    Status: {
      id: string;
      type: string;
      status: {
        name: string;
      };
    };
    Link: {
      id: string;
      type: string;
      url: string;
    };
    Name: {
      id: string;
      type: string;
      title: [
        {
          type: string;
          text: {
            content: string;
          };
        }
      ];
    };
  };
};
