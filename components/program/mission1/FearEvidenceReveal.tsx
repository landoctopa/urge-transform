import React from 'react';

interface Props {
  title?: string;
}

const FearEvidenceReveal: React.FC<Props> = ({ title }) => (
  <div>{title || 'FearEvidenceReveal'}</div>
);

export default FearEvidenceReveal;
