import React from 'react';

interface Props {
  title?: string;
}

const FearExplorer: React.FC<Props> = ({ title }) => (
  <div>{title || 'FearExplorer'}</div>
);

export default FearExplorer;
