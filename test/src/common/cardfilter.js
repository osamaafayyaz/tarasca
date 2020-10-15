// Cardfilter
import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';

import FilterList from '@material-ui/icons/FilterList';

export function CardFilter(props){
    return (
        <NativeSelect IconComponent={FilterList}>
            <option value={''}>All</option>
            <option value={''}>My</option>
            <option value={''}>Other</option>
        </NativeSelect>
    )
}


/* <NativeSelect fullWidth
                      value={this.state.selectedOption}
                      input={<OutlinedInput fullWidth name="user" id="user" labelWidth={10}/>}
                      onChange={(event) => {
                        this.setState({selectedOption:event.target.value})
                        this.props.setUser(event.target.value)}
                      } 
                    >
                      {options.map((option)=>(<option key={option.value} value={option.value}>{option.label}</option>))}
                  </NativeSelect>    */