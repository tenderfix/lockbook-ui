import React, { FunctionComponent } from 'react';

export interface IconProps {
  width: number;
  height: number;
}

const IconMobile: FunctionComponent<IconProps> = ({ width, height }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15 24">
      <path
        id="Differenzmenge_2"
        data-name="Differenzmenge 2"
        d="M13,24H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H13a2,2,0,0,1,2,2V22A2,2,0,0,1,13,24ZM2,4V20H13V4Z"
        fill="#bfbfbf"
      />
    </svg>
  );
};

export default IconMobile;
