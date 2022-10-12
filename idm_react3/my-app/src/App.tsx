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
    console.log('upload')
    let file = this.state.file
    console.log(file)
    // let fileData = fs.readFileSync(file).toString('hex')

    const bodyFormData = new FormData()
    axios.post("http://127.0.0.1:5000/",{
      data: file
    })
    .then((response) => {
      console.log(response)
    })
  }

  handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const file = (e.target as HTMLInputElement).files;
    console.log(file)
    const reader = new FileReader()
    const fileByteArray = [];
    console.log('hey')
    if(file === null){
    console.log('null')
      return
    }
    else{
      reader.readAsArrayBuffer(file[0]);

      console.log('not null')
      reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const array = new Uint8Array(evt.target.result[0])
        array.forEach(element => fileByteArray.push(element))
      }
      console.log(fileByteArray)
    }
  }
  this.setState({file:file})
}
  
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
