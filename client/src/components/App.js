import React, { Component } from 'react';
import axios from 'axios';
import Input from "./Input";
const apiUrl = "http://localhost:5000/";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    getConfig = async () => {
        let res = await axios({
            method: 'get',
            url: `${apiUrl}config`,
        });
        this.setState({
            apiResponse: res.data.words
        })
    };

    sendWord = async (word) => {
        let res = await axios({
            method: 'post',
            url: `${apiUrl}word`,
            headers: {'Content-Type':'application/json'},
            data:{
                "hans":word
            }
        });
        this.setState({
            apiResponse: res.data.message
        })
    };

    async componentWillMount() {
        await this.getConfig();
        // await this.sendWord("hellos");
    }


  render() {
      const App = () => (
      <div>
          <p className="App-intro">;{this.state.apiResponse}</p>
          <Input/>
      </div>
    );
    return (
      <App/>
    );
  }
}

export default App;
