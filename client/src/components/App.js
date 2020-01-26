import React, { Component } from 'react';
import axios from 'axios';
import Input from "./Input";
const apiUrl = "http://localhost:5000/";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            words: [],
            config:{},
            initError : false
        };
    }

    getConfig = async () => {
        let res = await axios({
            method: 'get',
            url: `${apiUrl}config/input`,
        });
        if(res.data.length !== 0 && Object.entries(res.data.config).length !== 0 && res.data.config.constructor === Object){
            this.setState({
                words: res.data.words,
                config: res.data.config
            })
        }else{
            this.setState({
                initError : true
            })
        }

    };

    sendWord = async (word) => {
        let res = await axios({
            method: 'post',
            url: `${apiUrl}word`,
            headers: {'Content-Type':'application/json'},
            data:{ word }
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
      const {
          words,
          config
      } = this.state;
      const App = () => (
      <div>
          <Input
              words={words}
              config={config}
          />
      </div>
    );
    return (
      <App/>
    );
  }
}

export default App;
