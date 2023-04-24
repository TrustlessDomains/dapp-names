import React, { ReactNode, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Container, WrapTooltip } from './ToolTips.styled';

interface IProps {
  name?: string;
  note?: ReactNode;
  className?: string;
}

export const ToolTip = ({ name, note, className }: IProps): JSX.Element => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <Container>
      {name && <p className={className || 'tooltip-name'}>{name}</p>}
      {note && (
        <div
          onMouseEnter={() => {
            setShow(true);
          }}
          onMouseLeave={() => {
            setShow(false);
          }}
          className="penguin_icon"
        >
          <OverlayTrigger
            placement="bottom"
            show={show}
            delay={{ show: 0, hide: 200 }}
            overlay={
              <WrapTooltip
                id="tooltip"
                onMouseEnter={() => {
                  setShow(true);
                }}
                onMouseLeave={() => {
                  setShow(false);
                }}
              >
                {note}
              </WrapTooltip>
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99935 18.9584C5.05935 18.9584 1.04102 14.9401 1.04102 10.0001C1.04102 5.06008 5.05935 1.04175 9.99935 1.04175C14.9393 1.04175 18.9577 5.06008 18.9577 10.0001C18.9577 14.9401 14.9393 18.9584 9.99935 18.9584ZM9.99935 2.29175C5.74852 2.29175 2.29102 5.74925 2.29102 10.0001C2.29102 14.2509 5.74852 17.7084 9.99935 17.7084C14.2502 17.7084 17.7077 14.2509 17.7077 10.0001C17.7077 5.74925 14.2502 2.29175 9.99935 2.29175ZM10.5918 11.1368C10.6118 11.0768 10.7252 10.8493 11.3352 10.441C12.3185 9.78179 12.7586 8.84004 12.5761 7.78837C12.3911 6.72587 11.5251 5.85344 10.4701 5.6676C9.6993 5.53094 8.91849 5.73836 8.32515 6.23503C7.72599 6.73753 7.38277 7.47499 7.38277 8.25916C7.38277 8.60416 7.66277 8.88416 8.00777 8.88416C8.35277 8.88416 8.63277 8.60416 8.63277 8.25916C8.63277 7.84582 8.81358 7.45683 9.12858 7.19267C9.44191 6.93017 9.84181 6.82266 10.2526 6.89766C10.791 6.99266 11.2502 7.45679 11.3452 8.00179C11.381 8.20762 11.4902 8.83257 10.6394 9.40173C9.95024 9.86423 9.55855 10.2884 9.40771 10.7384C9.29772 11.0659 9.4743 11.42 9.8018 11.53C9.86763 11.5525 9.93433 11.5626 10.0002 11.5626C10.2602 11.5626 10.5035 11.3976 10.5918 11.1368ZM10.8494 13.7501C10.8494 13.2901 10.4769 12.9167 10.016 12.9167H10.0077C9.54769 12.9167 9.17843 13.2901 9.17843 13.7501C9.17843 14.2101 9.55603 14.5834 10.016 14.5834C10.476 14.5834 10.8494 14.2101 10.8494 13.7501Z"
                fill="white"
              />
            </svg>
          </OverlayTrigger>
        </div>
      )}
    </Container>
  );
};

export default ToolTip;
