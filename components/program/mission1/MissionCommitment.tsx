import React from 'react';

interface Props {
  title?: string;
}

const MissionCommitment: React.FC<Props> = ({ title }) => (
  <div>{title || 'MissionCommitment'}</div>
);

export default MissionCommitment;
