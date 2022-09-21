import logo from './logo.svg';
import React, {Component} from 'react';
import './App.css';
import axios from 'axios'

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
    // axios.post({
    //   url:'http://127.0.0.1:5000/',
    //   method: 'POST',
    //   headers:{

    //   },
    //   data: file,
    // }).then((res) =>{
    //   console.log('done')
    // })
  }

  handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const file = (e.target as HTMLInputElement).files || [];
    console.log(file)
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