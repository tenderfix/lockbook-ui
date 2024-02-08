import React, { FunctionComponent } from 'react';

export interface IconProps {
  width: number;
  height: number;
}

const IconGaeb: FunctionComponent<IconProps> = ({ width, height }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
      <path
        fill="#F5F5F5"
        d="M0 10C0 4.477 4.477 0 10 0h30c5.523 0 10 4.477 10 10v30c0 5.523-4.477 10-10 10H10C4.477 50 0 45.523 0 40V10Z"
      />
      <path
        fill="#313030"
        stroke="#000"
        strokeWidth={2}
        d="M28.9 12H12v25h25V19.155L28.9 12Zm6.213 7.845v.072h-7.075v-6.25h.08l6.995 6.178ZM13.887 35.333V13.667H26.15v7.916h8.962v13.75H13.887Z"
      />
      <path fill="#118C77" d="M14.9 34.342V14.668H20l5.159-.006v19.68h-10.26Z" />
    </svg>
  );
};

export default IconGaeb;
