import React from 'react';
import { Col, Grid, Row} from 'rsuite';
import Sidebar from '../components/Sidebar';

// eslint-disable-next-line arrow-body-style
const Home = () => {
  return (
    <Grid fluid className="h-100">
      <Row>
        <Col xs={24} md={8}>
          <Sidebar/>
        </Col>
      </Row>
    </Grid>
  );
};

export default Home;
