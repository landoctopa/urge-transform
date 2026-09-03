import React from 'react';

interface Props {
  title?: string;
}

const ResourceInventory: React.FC<Props> = ({ title }) => (
  <div>{title || 'ResourceInventory'}</div>
);

export default ResourceInventory;
