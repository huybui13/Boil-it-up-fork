import React, { useState } from 'react';
import { Container, Grow, Grid, Paper, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';

import useStyles from './styles';
import Posts from '../Posts/Posts';
import Pagination from '../Pagination';
import SortedPosts from '../SortedPosts/SortedPosts';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [currentId, setCurrentId] = useState(null);
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const [tags, setTags] = useState([]);

  return (
    <Grow in>
      <Container maxWidth='xl'>
        <Grid
          container
          justifyContent='space-between'
          alignItems='stretch'
          spacing={3}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={12} md={12}>
            <SortedPosts setCurrentId={setCurrentId} />
          </Grid>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={3}>
          {!searchQuery && !tags.length && (
            <div>
              <Paper elevation={6} className={classes.pagination}>
                <Pagination page={page} />
              </Paper>
            </div>
          )}
        </Grid> */}
        {!searchQuery && !tags.length && (
          <div>
            <Paper elevation={6} className={classes.pagination}>
              <Pagination page={page} />
            </Paper>
          </div>
        )}
      </Container>
    </Grow>
  );
};

export default Home;
