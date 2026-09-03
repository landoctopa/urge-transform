import React from 'react';

interface Props {
  title?: string;
}

const VisibilityAction: React.FC<Props> = ({ title }) => (
  <div>{title || 'VisibilityAction'}</div>
);

export default VisibilityAction;
