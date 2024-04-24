import React, { useState } from 'react';
import {
  Container,
  Grow,
  Grid,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';

import useStyles from './styles';
import Form from '../Form/Form';

const Newpost = () => {
  const [currentId, setCurrentId] = useState(null);
  const classes = useStyles();

  const { id } = useParams();
  //console.log(id);

  return (
    <Grow in>
      <Container style={{ maxWidth: "65%" }}>
        <Grid
          container
          justifyContent='space-between'
          alignItems='stretch'
          spacing={3}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={12} md={12}>
            <Form currentId={id} setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Newpost;
