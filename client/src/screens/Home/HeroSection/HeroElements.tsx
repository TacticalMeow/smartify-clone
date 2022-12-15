import { Box } from '@mui/system';
import React, { FC } from 'react';
import { Fade } from 'react-awesome-reveal';

interface VideoProps {
    videoSrc: string,
    mute: boolean,
    loop: boolean,
    autoPlay: boolean,
    type: string,

}
export const HeroContainer: FC = ({ children }) => (
  <Fade duration={750}>
    <Box sx={(theme) => ({
      background: theme.palette.common.black,
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      height: '1000px',
      width: '100%',
      position: 'relative',
      zIndex: 1,
      flexDirection: 'column',
    })}
    >
      {children}
    </Box>
  </Fade>
);

export const HeroBg: FC = ({ children }) => (
  <Box sx={{
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  }}
  >
    {children}
  </Box>
);

export const VideoBg: FC<VideoProps> = ({
  videoSrc, mute, loop, autoPlay, type,
}) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video
    style={{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: '#232a34',
    }}
    muted={mute}
    autoPlay={autoPlay}
    loop={loop}
  >
    <source src={videoSrc} type={type} />
  </video>
);
