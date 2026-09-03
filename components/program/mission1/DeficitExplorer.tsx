import React from 'react';

interface Props {
  title?: string;
}

const DeficitExplorer: React.FC<Props> = ({ title }) => (
  <div>{title || 'DeficitExplorer'}</div>
);

export default DeficitExplorer;
