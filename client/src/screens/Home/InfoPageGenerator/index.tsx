import { FC } from 'react';
import * as React from 'react';
import { Box } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { Fade } from 'react-awesome-reveal';

export type InfoPage = {
    id: string,
    title: string,
    description: string,
    img: string,
    buttonLabel: string,
    onClick: ()=>void,
}

const InfoPageGenerator: FC<InfoPage> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id, title, description, img, buttonLabel, onClick,
}) => (
  <Fade duration={750} fraction={0.025}>
    <Box sx={{
      backgroundColor: '#0c0c0c',
      display: 'flex',
      zIndex: 1,
      width: '100%',
      maxWidth: '100%',
      height: '860px',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      flexDirection: 'column',
      backgroundImage: `url(${img})`,
      overflow: 'hidden',
    }}
    >
      <Typography variant="h1" sx={{ marginLeft: '5%' }}>
        {title}
      </Typography>
      <Typography variant="h2" sx={{ marginLeft: '10%' }}>
        {' '}
        {description}
        {' '}
      </Typography>
      <Button
        variant="contained"
        onClick={onClick}
        size="large"
        sx={(theme) => ({
          width: '200px',
          marginLeft: '10%',
          color: theme.palette.common.white,
        })}
      >
        {buttonLabel}
      </Button>
    </Box>
  </Fade>

);

export default InfoPageGenerator;
