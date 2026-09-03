import React from 'react';

interface Props {
  title?: string;
}

const AskReadiness: React.FC<Props> = ({ title }) => (
  <div>{title || 'AskReadiness'}</div>
);

export default AskReadiness;
