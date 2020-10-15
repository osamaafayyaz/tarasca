// faq.js
import React, { Fragment, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import faq from './faq.json';

export const Faq = (props) => {
    const [expanded, handleChange] = useState("none");
    const [test,handleTestChange] = useState("none");
    
    return(
      <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"800px", display:"inline-block"}}>
        <Grid container
          justify="center"
          direction="column"
          alignItems="stretch"
          spacing={24}
          className="boxed"
          style={{marginTop:10}}
        >
          <Grid item style={{textAlign:"left"}}>
            <Typography variant="display1">Frequently asked questions</Typography>
          </Grid>
          <Grid item style={{textAlign:"left"}}>

            <List>                  
                { 
                    faq.faq.map((sec,index)=>{
                        const idstr = 'panel'+index;
                        return(
                          <ExpansionPanel style={{backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}} expanded={expanded === idstr || expanded.includes(idstr)} onChange={()=>handleChange(expanded === idstr || expanded.includes(idstr) ? "false":idstr)}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant='h6'>{sec.section}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <dl>
                                {
                                    sec.questions.map((qa,index1)=>{
                                        const idque = idstr+index1;
                                        return (
                                          <div onClick={()=>handleTestChange(test === idque ? 'false' : idque)}>
                                            <ExpansionPanel style={{backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}} expanded={test === idque}>
                                              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant='subtitle1'>{`${index1+1}. ${qa.Q}`}</Typography>
                                              </ExpansionPanelSummary>
                                              <ExpansionPanelDetails>
                                                <Typography variant='subtitle1'>{qa.A}</Typography>
                                              </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                          </div>
                                        // <Fragment>
                                        //     <dt><Typography variant="subtitle1">{qa.Q}</Typography></dt>
                                        //     <dd><Typography variant="subtitle1">{qa.A}</Typography></dd>
                                        // </Fragment>
                                        )
                                    })
                                }
                              </dl>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        )
                    })
                }
            </List>

          </Grid>
        </Grid>
      </div>
    )
  }