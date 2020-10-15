import React from 'react';
import {  Row, Col, Container} from 'reactstrap';
import {OrderBook} from '../exchange/orderbook';

export function CardInfoOrders({askOrders,bidOrders,NQTdivider}){
  return (
    <Container>
    <Row>
      <Col>Asks</Col>
      <Col>Bids</Col>
    </Row>
    <Row>
      <Col><OrderBook orders={askOrders} /></Col>
      <Col><OrderBook orders={bidOrders} /></Col>
    </Row>
    </Container>
  );
}