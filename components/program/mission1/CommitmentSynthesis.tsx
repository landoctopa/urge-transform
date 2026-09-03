import React from 'react';

interface Props {
  title?: string;
}

const CommitmentSynthesis: React.FC<Props> = ({ title }) => (
  <div>{title || 'CommitmentSynthesis'}</div>
);

export default CommitmentSynthesis;
