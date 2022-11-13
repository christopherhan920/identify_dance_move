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
    file: null
  }

  upload(){
    console.log("I made it into upload()")
    // let file = fs.readFileSync(this.state.file as any).toString('hex')
    let file = this.state.file
    console.log("File: " + file)
    // let fileData = fs.readFileSync(file).toString('hex')

    // const bodyFormData = new FormData()
    console.log("I make it to right before the post")
    // axios.defaults.headers.post['Content-Type'] = 'application/octet-stream';
    axios.post('http://127.0.0.1:5000/post', {
      data: file
      // headers: new Headers({
      //   //'Content-Type': 'application/octet-stream'
      //   //'Access-Control-Allow-Origin': '*',
      //   // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, UPDATE",
      //   // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
      // })
    })
    .then((response) => {
      console.log("Response.data: " + response.data)
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
        console.log("After setting state: " + this.state.file)
      }
      // this.state.file = byteFile
      // console.log("Type after setting state: " + typeof(this.state.file))
      console.log("Done with handlefile()")
    }
  }

  // console.log("Before setting state: " + this.state.file)
  // this.state.file = fileByteArray // change, not safe..
  // // this.setState({file : "HJELLLOOOO"})
  // console.log("After setting state: " + this.state.file)
}

// Another idea

// readFile(file) {
//   return new Promise((resolve, reject) => {
//     // Create file reader
//     let reader = new FileReader()
//     // Register event listeners
//     reader.addEventListener("loadend", e => resolve(e.target.result))
//     reader.addEventListener("error", reject)
//     // Read file
//     reader.readAsArrayBuffer(file)
//   })
// }

// async getAsByteArray(file) {
//   return new Uint8Array(await this.readFile(file) as any)
// }



  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <form>
            <h1>Dance File Upload</h1>
            <input type="file" name="file" onChange={(e) => this.handleFile(e)}/>
            <button type="submit" onClick={this.upload}> Upload</button>
          </form>
        </header>
      </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a>
//           Learn React
//         </a>
//         <form>
//           <h1>Dance File Upload</h1>
//           <input type="file" name="file" onChange={(e) => this.handleFile(e)}/>
//           <button type="submit" onClick={upload}>Upload</button>
//         </form>
//       </header>
//     </div>
//   );
// }

export default App;
