import React, { FunctionComponent } from 'react';

export interface IconProps {
  width?: number;
  height?: number;
}

const IconDesktop: FunctionComponent<IconProps> = ({ width, height }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 22">
      <path
        id="Differenzmenge_1"
        data-name="Differenzmenge 1"
        d="M16.5,22h-9V19.5H9.75V17H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H22a2,2,0,0,1,2,2V15a2,2,0,0,1-2,2H14.25v2.5H16.5V22ZM2,2V15H22V2Z"
        fill="#bfbfbf"
      />
    </svg>
  );
};

IconDesktop.defaultProps = {
  width: 24,
  height: 24,
};

export default IconDesktop;
