import React, {Component} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Doughnut from 'react-chartjs-2';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const data = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};


export default class PortfolioAllocation extends Component{
    constructor(props){
        super(props)
        this.platformAllocation = this.platformAllocation.bind(this);
        this.assetAllocation = this.assetAllocation.bind(this);
        this.state = {
            chartType: '',
            visualData: {},
            cashInclusion: false,
        }
    }
    handleChange = (event) => {
        this.setState({chartType: event.target.value}, function(){
            if(this.state.chartType === 'Asset Allocation'){
                this.assetAllocation();
            }
            else{
                this.platformAllocation();
            }
        });
        
    }
    handleSwitchChange = (event) => {
        
        this.setState({cashInclusion: event.target.checked}, function(){
            if(this.state.chartType === 'Asset Allocation'){
                this.assetAllocation();
            }
            else{
                this.platformAllocation();
            };
        });
    }
    
    platformAllocation(){
        //get data
        var total = 0
        var robinTotalEquity = this.props.robinData['totalEquity'];
        var robinCash = this.props.robinData['cash']

        var coinbaseTotalEquity = this.props.coinbaseData['totalEquity'];
        var coinbaseCash = this.props.coinbaseData['cash']

        var labels = []
        var data = []
        var backgroundColor = []
        var hoverBackgroundColor = []

        if(this.state.cashInclusion === true){
            if(this.props.platforms.includes('robinhood')) {
                total += robinTotalEquity
                var robinShowEquity = robinTotalEquity
            }
            if(this.props.platforms.includes('coinbasepro')) {
                total += coinbaseTotalEquity
                var coinbaseShowEquity = coinbaseTotalEquity
            }
        }
        else if(this.state.cashInclusion === false){
            if(this.props.platforms.includes('robinhood')) {
                total += (robinTotalEquity - robinCash)
                var robinShowEquity = robinTotalEquity - robinCash
            }
            if(this.props.platforms.includes('coinbasepro')) {
                total += (coinbaseTotalEquity - coinbaseCash)
                var coinbaseShowEquity = coinbaseTotalEquity - coinbaseCash
            }
        }


        if(this.props.platforms.includes('robinhood')){
            labels.push('Robinhood')
            data.push(Math.round(robinShowEquity/total*10000)/ 100)
            backgroundColor.push('#8bc34a') 
            hoverBackgroundColor.push('#a2cf6e')
        }
        if(this.props.platforms.includes('coinbasepro')){
            labels.push('Coinbase Pro')
            data.push(Math.round(coinbaseShowEquity/total*10000)/ 100)
            backgroundColor.push('#2196f3') 
            hoverBackgroundColor.push('#4dabf5')
        }


        var datasets = [{'data': data, 'backgroundColor': backgroundColor, 'hoverBackgroundColor' : hoverBackgroundColor}];
        var fullData = {'labels': labels, 'datasets':datasets}
        this.setState({visualData: fullData},
          () => console.log(this.state.visualData)  
        );
        
    }

    assetAllocation(){
        //get data
        var total = 0
        var robinPositions = this.props.robinData['positions'];
        var robinTotalEquity = this.props.robinData['totalEquity']
        var robinCash = this.props.robinData['cash']

        var coinbasePositions = this.props.coinbaseData['assets'];
        var coinbaseTotalEquity = this.props.coinbaseData['totalEquity']
        var coinbaseCash = this.props.coinbaseData['cash']

        var groupData = {}

        var labels = []
        var data = []
        var backgroundColor = []
        var hoverBackgroundColor = []

        if(this.state.cashInclusion === true){
            if(this.props.platforms.includes('robinhood')) {
                total += robinTotalEquity
                for(let position in robinPositions){
                    if(position + '|' + robinPositions[position]['type'] in groupData){
                        groupData[position + '|' + robinPositions[position]['type']] += robinPositions[position]['equity']
                    }
                    else{
                        groupData[position + '|' + robinPositions[position]['type']] = robinPositions[position]['equity']
                    }
                }   
                if('cash|cash' in groupData){
                    groupData['cash|cash'] += robinCash
                }
                else{
                    groupData['cash|cash'] = robinCash
                }
            }
            if(this.props.platforms.includes('coinbasepro')) {
                total += coinbaseTotalEquity
                for(let position in coinbasePositions){
                    if(position + '|crypto' in groupData){
                        groupData[position + '|crypto'] += coinbasePositions[position]['equity']
                    }
                    else{
                        groupData[position + '|crypto'] = coinbasePositions[position]['equity']
                    }
                }
                if('cash|cash' in groupData){
                    groupData['cash|cash'] += coinbaseCash
                }
                else{
                    groupData['cash|cash'] = coinbaseCash
                }
            }
        }
        else if(this.state.cashInclusion === false){
            if(this.props.platforms.includes('robinhood')) {
                total += (robinTotalEquity - robinCash)
                for(let position in robinPositions){
                    if(position + '|' + robinPositions[position]['type'] in groupData){
                        groupData[position + '|' + robinPositions[position]['type']] += robinPositions[position]['equity']
                    }
                    else{
                        groupData[position + '|' + robinPositions[position]['type']] = robinPositions[position]['equity']
                    }
                }   
            }
            if(this.props.platforms.includes('coinbasepro')) {
                total += (coinbaseTotalEquity - coinbaseCash)
                for(let position in coinbasePositions){
                    if(position + '|crypto' in groupData){
                        groupData[position + '|crypto'] += coinbasePositions[position]['equity']
                    }
                    else{
                        groupData[position + '|crypto'] = coinbasePositions[position]['equity']
                    }
                }
            }
        }

        for(let asset in groupData){
            var label = asset.split("|")
            labels.push(label[0])
            data.push(Math.round(groupData[asset]/total*10000)/ 100)
            var randomColor = Math.floor(Math.random()*16777215).toString(16)
            backgroundColor.push('#'+randomColor)
            hoverBackgroundColor.push('#'+randomColor)
        }


        var datasets = [{'data': data, 'backgroundColor': backgroundColor, 'hoverBackgroundColor' : hoverBackgroundColor}];
        var fullData = {'labels': labels, 'datasets':datasets}
        this.setState({visualData: fullData},
          () => console.log(this.state.visualData)  
        );
    }

    render(){
        return(
            <div>
                <Grid>
                    <Grid sm={3}>
                        <FormControl variant="filled" fullWidth>
                            <InputLabel id="demo-simple-select-filled-label">Allocation</InputLabel>
                            <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value= {this.state.chartType}
                            onChange= {this.handleChange}
                            >
                            
                            <MenuItem value={'Platform Allocation'}>Platform Allocation</MenuItem>
                            <MenuItem value={'Asset Allocation'}>Asset Allocation</MenuItem>
                            <MenuItem value={'Holding Type Allocation'}>Holding Type Allocation</MenuItem>
                            <Divider/>
                            <MenuItem value={'Asset Allocation by Platform'}>Asset Allocation by Platform</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                            <Switch
                                checked={this.state.cashInclusion}
                                onChange={this.handleSwitchChange}
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Include Cash"
                        />
                    </Grid>
                    <Doughnut data={this.state.visualData}></Doughnut>
                </Grid>
            </div>
        );
    }
}