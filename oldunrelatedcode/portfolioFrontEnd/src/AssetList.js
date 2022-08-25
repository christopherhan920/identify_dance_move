import AssetClass from './AssetList.css';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import clsx from 'clsx';
import AccordionActions from '@material-ui/core/AccordionActions';

export function viewRobinhood(){
    this.setState({
        asset: 'robinhood'
    })
}
export function viewCoinbase(){
    this.setState({
        asset: 'coinbasepro'
    })
}

export default class AssetList extends Component{
    constructor(props){
      super(props);
      this.state = {
        asset: 'robinhood'
      }
    }
    
    render(){
      if(this.props.robinData['positions'] == null || this.props.robinData == null){
        return null
      }
      if(this.props.platform === 'robinhood'){
          if(this.props.robinData != null){
              console.log(this.props.robinData)
              var assets = this.props.robinData['positions']
              console.log(assets)
            return(
                <div className={'list-of-assets'} style={{overflow: 'auto'}}>
                    <Typography>Robinhood</Typography>
                    {Object.keys(assets).map(asset => (
                        <Accordion out>
                        <AccordionSummary
                          aria-controls="panel1c-content"
                          id="panel1c-header"
                        >
                          <div className={'column'} width='66.66%'>
                            <Typography className={AssetClass.heading} key={asset}>{asset}: {assets[asset]['name']}</Typography>
                          </div>
                          <div className={'column-right'} width ='33.33%'>
                            <Typography className={AssetClass.secondaryHeading} key={asset}>Price: ${assets[asset]['price']}</Typography>
                          </div>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails className={AssetClass.details}>
                          <div className={'column'} width ='33.33%'>
                            <Typography className={AssetClass.secondaryHeading} key={asset}>Quantity: {assets[asset]['quantity']}</Typography>
                          </div>
                          <div className={'column'} width ='33.33%'>
                            <Typography className={AssetClass.secondaryHeading} key={asset}>Equity: ${assets[asset]['equity']}</Typography>
                          </div>
                          <div className={clsx('column', AssetClass.helper)} width='33.33%'>
                            <Typography className={AssetClass.secondaryHeading} width ='50%' key={asset}>%Change: {assets[asset]['percent_change']}%</Typography>
                            <Typography className={AssetClass.secondaryHeading} width ='50%' key={asset}>Change: {assets[asset]['equity_change']}</Typography>
                          </div>
                        </AccordionDetails>
                        <Divider />
                      </Accordion>
                    ))}
              </div>
            );
          }
        else return(<div>
            <Accordion>
                
            </Accordion>
        </div>)
      }
      else if(this.props.platform === 'coinbasepro'){
        if(this.props.coinbaseData == null){
          return null
        }
        if(this.props.coinbaseData != null){
            console.log(this.props.coinbaseData)
            var assets = this.props.coinbaseData['assets']
          return(
              <div className={'list-of-assets'} style={{overflow: 'auto'}}>
                  <Typography>Coinbase Pro</Typography>
                  {Object.keys(assets).map(asset => (
                      <Accordion >
                      <AccordionSummary
                        aria-controls="panel1c-content"
                        id="panel1c-header"
                      >
                        <div className={'column'} width='33.33%'>
                          <Typography className={AssetClass.heading} key={asset}>{asset}: {}</Typography>
                        </div>
                        <div className={'column'} width ='33.33%'>
                          <Typography className={AssetClass.secondaryHeading} key={asset}>Price: ${assets[asset]['price']}</Typography>
                        </div>
                      </AccordionSummary>
                      <Divider />
                      <AccordionDetails className={AssetClass.details}>
                        <div className={'column'} width ='33.33%'>
                          <Typography className={AssetClass.secondaryHeading} key={asset}>Quantity: {assets[asset]['balance']}</Typography>
                        </div>
                        <div className={'column'} width ='33.33%'>
                          <Typography className={AssetClass.secondaryHeading} key={asset}>Equity: ${assets[asset]['equity']}</Typography>
                        </div>
                      </AccordionDetails>
                      <Divider />
                    </Accordion>
                  ))}
            </div>
          );
        }
      else return(<div>
          <Accordion>
              
          </Accordion>
      </div>)
      }
    }
}