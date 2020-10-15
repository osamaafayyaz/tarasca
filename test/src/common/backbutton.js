import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import { withRouter } from 'react-router-dom';


class _BackButton extends Component {
    render (){
        return(
                <IconButton 
                    onClick={this.props.history.goBack}
                ><ArrowBackIos/></IconButton>
        )
    }
}

export const BackButton = withRouter(_BackButton);