import React from 'react';

interface Props {
  title?: string;
}

const MissionTransformation: React.FC<Props> = ({ title }) => (
  <div>{title || 'MissionTransformation'}</div>
);

export default MissionTransformation;
