import ImportExcelButton from 'components/ImportExcelButton';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ExamineePage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const history = useHistory();
  const { url } = useRouteMatch();
  return (
    <div>
      <ImportExcelButton />
    </div>
  );
};

export default ExamineePage;
