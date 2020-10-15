import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { fetchCards } from '../common/common';
import {CardDisplay} from './carddisplay';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Thumb, ThumbMobile } from './thumb';
import {Filter} from './filter';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';


function ThumbsList({cards, slider}){
  if(cards == null) {
    return null;
  }
  else {
    return (
      <Grid container
        justify="center"
        direction="row"
        alignItems="flex-start"
        spacing={8}
      >
      {cards.map(
        (card, index) => (
          <Grid item key={index} xs={6} sm={4} md={2} lg={1}>
          <Thumb card={card} index={index} width="80px"
            onClick={slider ? slider.slickGoTo:undefined}/>
          </Grid>
        )
      )}
      </Grid>
    );
  }
}

function ThumbsListMobile({cards, history}){
  if(cards == null) {
    return null;
  }
  else {
    return (
      <Grid container
        justify="center"
        direction="row"
        alignItems="flex-start"
        spacing={8}
      >
      {cards.map(
        (card, index) => (
          <Grid item key={index} xs={6} sm={4} md={2} lg={1}>
          <ThumbMobile card={card} index={index} 
            onClick={()=>history.push('/game/card/'+card.asset)}/>
          </Grid>
        )
      )}
      </Grid>
    );
  }
}


export class CardDeck extends Component {
  constructor(props){
    super(props);
    this.state = {
      cards:[],
      selectedChannel:"all",
      slideIndex:0
    }
    this.refresh = this.refresh.bind(this);    
  }

  refresh(){
    var self = this;
    console.log("CardDeck: refresh: fetching cards");
    fetchCards(this.props.nodeurl,this.props.user.accountRs,this.props.collectionAccount)
    .then(function(response){
      self.setState({cards:response});
    })
    .catch(function(error) {console.log(error)});
  }

  componentDidMount(){
    this.refresh()
    this.timer = setInterval(this.refresh, 8000)
  }
  
  componentWillUnmount(){
    console.log("CardDeck: stop refresh");
    clearInterval(this.timer);
  }

  render() {
    let channels = new Set(this.state.cards.map((card) => {return card.channel}))
    let cards = []
    if (this.state.selectedChannel !== "all") {
      cards = this.state.cards.filter((card) => (card.channel === this.state.selectedChannel) & (this.props.showAllCards | (card.quantityQNT > 0)));
    }
    else {
      cards = this.state.cards.filter((card) => (this.props.showAllCards | (card.quantityQNT > 0)));
    } 
    const max = cards.length;
    var settings = {
      dots: true,
      className: "center",
      speed: 500,
      centerMode: false,
      centerPadding: "60px",
      slidesToShow: 5<=max ? 5:max,
      slidesToScroll: 5,
      beforeChange: (current, next) => this.setState({slideIndex:next}),
      responsive: [
        {
          breakpoint: 1920,
          settings: {
            slidesToShow: 5<=max ? 5:max,
            //slidesToScroll: 5<=max ? 5:max
            slidesToScroll: 1
          }
        },{
          breakpoint: 1670,
          settings: {
            slidesToShow: 3<=max ? 3:max,
            //slidesToScroll: 5<=max ? 5:max
            slidesToScroll: 1
          }
        },{
          breakpoint: 1280,
          settings: {
            slidesToShow: 3<=max ? 3:max,
            //slidesToScroll: 3<=max ? 3:max
            slidesToScroll: 1
          }
        },{
          breakpoint: 960,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
        <div style={{display:"block", textAlign:"center", width:"100%", padding:20}}>
          <Filter channels={[...channels]} onClick={(chan)=>this.setState({selectedChannel:chan})} />
          <div style={{width:"90%",marginLeft:"auto",marginRight:"auto"}}>
            <Hidden smDown>
              <div style={{width:"100%",padding:20}}>
                <Slider {...settings} arrows={true} ref={slider=>(this.slider = slider)}>
                  {
                    cards != null ? (
                      cards.map(
                        (card, index) => (
                          <CardDisplay key={index} card={card} {...this.props}/>
                        )
                      )
                    ): null
                  }
                </Slider>
              </div>
              <div style={{width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                <ThumbsList cards={cards} slider={this.slider}/>
              </div>
            </Hidden>
          </div>
          <Hidden mdUp>
            <div style={{width:"95%",marginLeft:"auto",marginRight:"auto"}}>
              <ThumbsListMobile cards={cards} {...this.props}/>
            </div>
          </Hidden>
        </div>
    );
  }  
}

