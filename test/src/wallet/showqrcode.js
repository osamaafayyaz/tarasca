import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import qs from 'qs';
import axios from 'axios';



export class ShowQrCode extends Component {
  constructor (props){
    super(props);
    this.state = {
      qrLoaded:false,
      qrCodeBase64:""
    };
  }

  componentDidMount() {
    var self = this;
    var query = {
      qrCodeData:self.props.user.accountRs,
      width:240,
      height:240
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const url_encodeQRCode = self.props.nodeurl+'?requestType=encodeQRCode';
    axios.post(url_encodeQRCode, qs.stringify(query), config).then(function(response) {
      console.log('Got it: Account QRCode');
      self.setState({qrLoaded:true,qrCodeBase64:response.data.qrCodeBase64})
    });
  }

  render(){
    const qrdataurl = "data:image/png;base64,"+this.state.qrCodeBase64;
    return(
      <Grid container
        justify="center"
        direction="column"
        spacing={24}
        style={{padding:20}}
      >
        <Grid item>
          <Typography variant="h6">
            {this.props.user.accountRs}
          </Typography>
        </Grid>
        <Grid item><img alt="your ARDOR address" src={qrdataurl}/></Grid>
        
      </Grid>
    );
  }
}