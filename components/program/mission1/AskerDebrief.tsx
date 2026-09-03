import React from 'react';

interface Props {
  title?: string;
}

const AskerDebrief: React.FC<Props> = ({ title }) => (
  <div>{title || 'AskerDebrief'}</div>
);

export default AskerDebrief;
