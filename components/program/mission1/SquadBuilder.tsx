import React from 'react';

interface Props {
  title?: string;
}

const SquadBuilder: React.FC<Props> = ({ title }) => (
  <div>{title || 'SquadBuilder'}</div>
);

export default SquadBuilder;
