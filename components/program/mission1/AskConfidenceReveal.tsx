import React from 'react';

interface Props {
  title?: string;
}

const AskConfidenceReveal: React.FC<Props> = ({ title }) => (
  <div>{title || 'AskConfidenceReveal'}</div>
);

export default AskConfidenceReveal;
