import React from 'react';

interface Props {
  title?: string;
}

const FutureStateExplorer: React.FC<Props> = ({ title }) => (
  <div>{title || 'FutureStateExplorer'}</div>
);

export default FutureStateExplorer;
