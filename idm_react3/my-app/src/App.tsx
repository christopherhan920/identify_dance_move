import logo from './logo.svg';
import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import * as fs from 'fs'

class App extends Component{
  constructor(props: {} | Readonly<{}>){
    super(props);
    this.upload = this.upload.bind(this);
  }

  state = {
    file: null,
    response: ""
  }

  upload() {
    // console.log("I made it into upload()")
    let file = this.state.file
    // console.log("File: " + file)

    // console.log("I make it to right before the post")

    axios.post('http://127.0.0.1:5000/post', {
      data: file
    })
    .then((response) => {
      console.log("I make it into then()")
      console.log("This is the response from App.tsx: " + response.data['Stick and Roll'])
      this.setState({response: response.data['Stick and Roll']})

      return response.data
    })
    .catch(error => {
      console.log('POST Error: ', error)
    })
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:5000/get', {
      data: this.state.response
    })
    .then((res) => {
      console.log("Response: ", res.data['GET Request'])
      this.setState({response: res.data['GET Request']})
    })
    .catch(error => {
      console.log('GET Error: ', error)
    })
  }


  async handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const file = (e.target as HTMLInputElement).files;

    console.log("File name: " + file[0].name);
    const reader = new FileReader()
    // const fileByteArray = [];
    if(file === null){
      console.log('null')
      return
    }
    else {
      // Option 1
      // const byteFile = await this.getAsByteArray(file[0])
      // console.log("byteFile: " + byteFile)
      // console.log("Type of byteFile: " + typeof(byteFile))

      // Option 2
      reader.readAsArrayBuffer(file[0])

      reader.onloadend = (evt) => {
      if (evt.target.readyState == FileReader.DONE) {

        var arrayBuffer = evt.target.result
        var fileByteArray = new Uint8Array(arrayBuffer as any)
        // for (var i = 0; i < array.length; i++) {
        //   fileByteArray.push(array[i])
        // }

        // console.log("Before setting state: " + this.state.file)
        // this.state.file = fileByteArray.toString()// change, not safe..
        this.state.file = fileByteArray // change, not safe..
        // console.log("Converted to hex: " + fs.readFileSync(fileByteArray as any).toString('hex'))
        // this.setState({file : fileByteArray})
        // console.log("After setting state: " + this.state.file)
      }
      // this.state.file = byteFile
      // console.log("Type after setting state: " + typeof(this.state.file))
      console.log("Done with handlefile()")
    }
  }
}

  
  render(){
    // For some reason, the below code returns 'cannot POST /' page: 

    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       <form method="post">
    //         <h1>Dance File Upload</h1>
    //         <input type="file" name="file" onChange={(e) => this.handleFile(e)}/>
    //         <button type="submit" onClick={this.upload}>Upload</button>
    //         <p>Response.data: </p>

    //         {
    //           this.state.response.length ? 
    //             <p>{this.state.response}</p> 
    //             : "no change"
    //         }

    //       </form>
    //     </header>
    //   </div>
    // );

    return this.state.response
            ? <div className="App-header">
                <h1>Response changed: </h1> 
                {this.state.response}
            </div>
            : 
            <div className="App">
              <header className="App-header">
                <form>
                  <h1>Dance File Upload</h1>
                  <input type="file" name="file" onChange={(e) => this.handleFile(e)}/>
                  <button type="submit" onClick={this.upload}> Upload</button>
                  {this.state.response}
                </form>
              </header>
            </div>

    // return (
    //   <div>
    //     <h1>Response: </h1>
    //     {this.state.response}
    //   </div>
    // )
  }
}

export default App;
