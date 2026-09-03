import React from 'react';

interface Props {
  title?: string;
}

const QuitConditionExplorer: React.FC<Props> = ({ title }) => (
  <div>{title || 'QuitConditionExplorer'}</div>
);

export default QuitConditionExplorer;
