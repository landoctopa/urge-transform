import React from 'react';

interface Props {
  title?: string;
}

const FearChallenge: React.FC<Props> = ({ title }) => (
  <div>{title || 'FearChallenge'}</div>
);

export default FearChallenge;
