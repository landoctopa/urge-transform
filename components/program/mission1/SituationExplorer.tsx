import React from 'react';

interface Props {
  title?: string;
}

const SituationExplorer: React.FC<Props> = ({ title }) => (
  <div>{title || 'SituationExplorer'}</div>
);

export default SituationExplorer;
