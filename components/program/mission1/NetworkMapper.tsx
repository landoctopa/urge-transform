import React from 'react';

interface Props {
  title?: string;
}

const NetworkMapper: React.FC<Props> = ({ title }) => (
  <div>{title || 'NetworkMapper'}</div>
);

export default NetworkMapper;
