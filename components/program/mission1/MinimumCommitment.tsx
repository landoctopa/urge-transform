import React from 'react';

interface Props {
  title?: string;
}

const MinimumCommitment: React.FC<Props> = ({ title }) => (
  <div>{title || 'MinimumCommitment'}</div>
);

export default MinimumCommitment;
