import React from 'react';

interface Props {
  title?: string;
}

const GapActionPlanner: React.FC<Props> = ({ title }) => (
  <div>{title || 'GapActionPlanner'}</div>
);

export default GapActionPlanner;
