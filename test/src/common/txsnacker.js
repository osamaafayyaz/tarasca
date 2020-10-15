import Component from "react";

// txsnacker

class TxSnacker extends Component{
    constructor(props){
        super(props);
        this.state = {
            unconfirmedTransactions:[],
            blockchainTransactions:[],
            checked_height:0  // load from disk?
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // if any unconf'ed tx is not in the prev state, snack it, then update state
        // if any new conf'ed tx is not in prev state, snack it, then update 
    }
}