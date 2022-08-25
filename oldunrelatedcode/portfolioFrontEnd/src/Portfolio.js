import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AssetList from './AssetList';
import axios from 'axios';
import './Portfolio.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PortfolioAllocation from './PortfolioAllocation';

export default class Portfolio extends Component{
    constructor(props){
        super(props)
        this.state = {
            platform: 'robinhood',
            platforms: [],
            robinEq: Float32Array,
            coinbaseEq: Float32Array,
            robinData: {},
            coinbaseData: {},
            testData: {}
        }
        this.updateAssetsView = this.updateAssetsView.bind(this);
    }

    updateAssetsView(platform){
        if(platform === 'robinhood'){
            this.setState({
                platform: 'robinhood'
            }, function () {
            console.log(this.state.platform);
            });
        }
        else if(platform === 'coinbasepro'){
            this.setState({
                platform: 'coinbasepro'
            }, function () {
                console.log(this.state.platform);
            });
        }
    }
    
    reQueryAssets(){
        this.setState({platforms: []})
        axios.get('http://localhost:8000/robinhood')
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        robinData : res.data,
                        platforms: this.state.platforms.concat('robinhood')
                    })
                }
            })
        axios.get('http://localhost:8000/coinbasepro')
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        coinbaseData : res.data,
                        platforms: this.state.platforms.concat('coinbasepro'),
                    }, () => {
                        console.log(this.state.testData)
                    })
                }
            })
    }

    render(){
        return (
            <Grid className= {'flex-section'} container spacing={2} direction={'row'} alignItems={'flex-start'} justify={'flex-start'}>
                <Grid item sm = {2} xs={12}>
                    <Button variant="contained" style={{backgroundColor: '#76ff03'}} className={'button'} padding={10} xs={12} onClick={() => {this.updateAssetsView('robinhood')}}>Robinhood   </Button>
                    
                </Grid>
                <Grid item sm = {2} xs={12}spacing ={3}>
                    <Button variant="contained" color="primary" className={'button'} padding={10} xs={12} onClick={() => {this.updateAssetsView('coinbasepro')}}>CoinbasePro</Button>

                </Grid>
                <Grid item sm = {2} xs={12} spacing ={3}>
                    <Button variant="contained" style={{backgroundColor: '#ff9100'}} className={'button'} padding={10} xs={12} onClick={() => {this.reQueryAssets()}}>Refresh    </Button> 
                </Grid>
                <Grid item sm = {9}>
                    
                </Grid>
                <Grid item sm ={4}>
                    <AssetList platform={this.state.platform} robinData={this.state.robinData} coinbaseData={this.state.coinbaseData}/>
                </Grid>
                <Grid item sm ={8} className={'footer'} position={'absolute'} height={500} left={0} bottom= {'100%'} width={'100%'}>
                    <Tabs>
                        <TabList>
                        <Tab>Portfolio Allocation</Tab>
                        <Tab>Charts</Tab>
                        </TabList>

                        <TabPanel>
                           <PortfolioAllocation 
                                robinData={this.state.robinData} 
                                coinbaseData={this.state.coinbaseData}
                                platforms={this.state.platforms}
                            >
                            </PortfolioAllocation>
                        </TabPanel>
                        <TabPanel>
                        <p>
                            <b>Luigi</b> (<i>Japanese: ルイージ Hepburn: Ruīji, [ɾɯ.iː.dʑi̥]</i>) (<i>English: /luˈiːdʒi/;
                            Italian: [luˈiːdʒi]</i>) is a fictional character featured in video games and related media
                            released by Nintendo. Created by prominent game designer Shigeru Miyamoto, Luigi is portrayed
                            as the slightly younger but taller fraternal twin brother of Nintendo's mascot Mario, and
                            appears in many games throughout the Mario franchise, often as a sidekick to his brother.
                        </p>
                        <p>
                            Source:{' '}
                            <a href="https://en.wikipedia.org/wiki/Luigi" target="_blank">
                            Wikipedia
                            </a>
                        </p>
                        </TabPanel>
                    </Tabs>
                </Grid>
            </Grid>
        );
    }
}
