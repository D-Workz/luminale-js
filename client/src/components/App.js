import React, { Component } from 'react';
import Input from "./Input";

class App extends Component {
  render() {
      document.body.className =  'bp3-dark';
      const App = () => (
      <div>
          <Input/>
      </div>
    );
    return (
      <App/>
    );
  }
}

export default App;
