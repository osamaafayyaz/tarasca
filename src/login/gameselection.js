import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { COLLECTIONACCOUNT } from '../common/constants';


const options = [
  {label:'Mythical Beings',value:COLLECTIONACCOUNT},
  {label:'French Deck',value:'ARDOR-YDK2-LDGG-3QL8-3Z9JD'},
  {label:'testnet.tarasca.org', value:COLLECTIONACCOUNT}
];


export class GameSelection extends React.Component {
  state = {
    anchorEl: null,
    selectedIndex: 0,
  };

  handleClickListItem = event => {
    console.log(event.currentTarget)
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
    this.props.setCollection(options[index].account);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    return (
        <NativeSelect fullWidth
          value={this.state.selectedOption}
          input={<OutlinedInput fullWidth name="user" id="user" labelWidth={10}/>}
          onChange={(event)=>this.props.setCollection(event.target.value)} 
        >
          {options.map((option)=>(<option key={option.value} value={option.value}>{option.label}</option>))}                          
        </NativeSelect>
    );
  }
}

//export default withStyles(styles)(GameSelection);

