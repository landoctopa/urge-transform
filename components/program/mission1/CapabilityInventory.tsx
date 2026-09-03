import React from 'react';

interface Props {
  title?: string;
}

const CapabilityInventory: React.FC<Props> = ({ title }) => (
  <div>{title || 'CapabilityInventory'}</div>
);

export default CapabilityInventory;
