import React from 'react';

interface Props {
  title?: string;
}

const StartingAssetsReveal: React.FC<Props> = ({ title }) => (
  <div>{title || 'StartingAssetsReveal'}</div>
);

export default StartingAssetsReveal;
