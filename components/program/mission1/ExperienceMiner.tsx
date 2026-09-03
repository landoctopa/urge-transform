import React from 'react';

interface Props {
  title?: string;
}

const ExperienceMiner: React.FC<Props> = ({ title }) => (
  <div>{title || 'ExperienceMiner'}</div>
);

export default ExperienceMiner;
