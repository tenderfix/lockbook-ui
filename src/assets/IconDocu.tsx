import React, { FunctionComponent } from 'react';

export interface IconProps {
  width: number;
  height: number;
}

const IconDraw: FunctionComponent<IconProps> = ({ width, height }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 57 57">
      <defs>
        <filter id="Pfad_1520" x="0" y="0" width="57" height="57" filterUnits="userSpaceOnUse">
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feFlood floodOpacity="0.302" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
        <clipPath id="clipPath">
          <path
            id="Pfad_1522"
            data-name="Pfad 1522"
            d="M32.684,22.275c-.424,0-10.41.131-10.41,10.4v23.66c0,.424.139,10.4,10.41,10.4H56.342c.424,0,10.4-.131,10.4-10.4V32.676c.008-.424-.139-10.4-10.4-10.4Z"
            transform="translate(-22.274 -22.275)"
            fill="none"
          />
        </clipPath>
      </defs>
      <g id="Icon" transform="translate(4.5 3.5)">
        <g transform="matrix(1, 0, 0, 1, -4.5, -3.5)" filter="url(#Pfad_1520)">
          <path
            id="Pfad_1520-2"
            data-name="Pfad 1520"
            d="M36.211,48H11.789C.177,48,0,36.716,0,36.211V11.79C0,.177,11.284,0,11.789,0H36.211C47.806,0,48,11.284,48,11.79V36.211C48,47.84,36.7,48,36.211,48Z"
            transform="translate(4.5 3.5)"
            fill="#f5f5f5"
          />
        </g>
        <g id="Gruppe_2017" data-name="Gruppe 2017" transform="translate(1.761 1.761)">
          <g id="Gruppe_2016" data-name="Gruppe 2016" clipPath="url(#clipPath)">
            <path
              id="Pfad_1524"
              data-name="Pfad 1524"
              d="M0,0H38.589V46.506H0Z"
              transform="translate(-1.014 -1.012)"
              fill="none"
            />
            <g id="Gruppe_2015" data-name="Gruppe 2015" transform="translate(5.279 5.227)">
              <path
                id="Pfad_1521"
                data-name="Pfad 1521"
                d="M160.7,141.157a12.734,12.734,0,0,1,3.806,9.313,12.484,12.484,0,0,1-3.806,9.238h-.049a12.791,12.791,0,0,1-2.02,1.712v2.1H144.315v-2.1a12.93,12.93,0,0,1-2.027-1.712,12.522,12.522,0,0,1-3.779-9.238,12.922,12.922,0,0,1,3.732-9.313c0-.029,0-.029.047-.029a12.628,12.628,0,0,1,9.218-3.757,12.45,12.45,0,0,1,9.15,3.757Zm-4.1,4.142a6.964,6.964,0,0,0-5.094-2.1,7.074,7.074,0,0,0-5.124,2.047.052.052,0,0,1-.059.057,7.274,7.274,0,0,0-2.008,5.171,6.978,6.978,0,0,0,2.067,5.124,7.175,7.175,0,0,0,3.72,2.039l-.087-.03a8.379,8.379,0,0,0,1.491.116,7.038,7.038,0,0,0,1.372-.116,7.586,7.586,0,0,0,3.722-2.01h0a6.929,6.929,0,0,0,2.122-5.124A7.026,7.026,0,0,0,156.6,145.3m-10.64,19.164h11.295v1.787H145.96Z"
                transform="translate(-138.509 -137.37)"
                fill="#202020"
              />
            </g>
            <rect
              id="Rechteck_1265"
              data-name="Rechteck 1265"
              width="6.604"
              height="10.413"
              transform="translate(14.978 35.081)"
              fill="#202020"
            />
            <path
              id="Pfad_1527"
              data-name="Pfad 1527"
              d="M0,0H7.429V15.168H0Z"
              transform="translate(38.062 -1.012)"
              fill="#0f8c77"
            />
            <path
              id="Pfad_1525"
              data-name="Pfad 1525"
              d="M0,0H7.429V12.632H0Z"
              transform="translate(38.062 15.923)"
              fill="#0f8c77"
            />
            <path
              id="Pfad_1526"
              data-name="Pfad 1526"
              d="M0,0H7.429V15.168H0Z"
              transform="translate(38.062 30.326)"
              fill="#0f8c77"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default IconDraw;
