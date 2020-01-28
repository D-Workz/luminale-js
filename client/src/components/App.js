import React, { Component } from 'react';
import axios from 'axios';
import Input from "./Input";
import { Position, Toaster, Intent } from '@blueprintjs/core';


class App extends Component {

    refHandlers = {
        toaster: ref => {
            this.toaster = ref;
        },
    };

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
            url: `/config/input`,
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
            url: `/word`,
            headers: {'Content-Type':'application/json'},
            data:{ word }
        });
        if(res.data.message) {
            const intent = Intent.SUCCESS;
            this.sendToast(res.data.message, intent);
        }else {
            const intent = Intent.DANGER;
            this.sendToast("Error", intent);
        }
    };

    async componentWillMount() {
        await this.getConfig();
    }

    sendToast = (message, intent ) => {
        const timeout = 1500;
        const icon = 'tick-circle';
        this.toaster.show({
            message: (
                <div>{message}</div>
            ),
            intent,
            icon,
            timeout,
        });
        this.toaster.dismiss();
    };


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
              sendWord={this.sendWord}
          />
          <Toaster
              position={Position.BOTTOM}
              ref={this.refHandlers.toaster}
          />
      </div>
    );
    return (
      <App/>
    );
  }
}

export default App;
