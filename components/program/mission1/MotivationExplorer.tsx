import React from 'react';

interface Props {
  title?: string;
}

const MotivationExplorer: React.FC<Props> = ({ title }) => (
  <div>{title || 'MotivationExplorer'}</div>
);

export default MotivationExplorer;
