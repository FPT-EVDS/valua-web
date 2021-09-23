import useQuery from 'hooks/useQuery';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const DetailAccountPage = () => {
  const params = useParams<ParamProps>();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  return (
    <div>
      Detail Account Page of {params.id} and edit is {String(isEditable)}
    </div>
  );
};

export default DetailAccountPage;
