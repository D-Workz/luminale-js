import React, { Component } from 'react';

class InputWords extends Component {

  constructor(props) {
    super(props);
    this.state = {
      textWidth: props.width,

    };
  }

  componentDidMount() {
    // const { importToShowLogs } = this.props;

    // this.setState({
    //   query:{
    //     limit,
    //     offset:0
    //   },
    // }, () => {
    //   this.requestImportLogs();
    // });
  }


  render() {
    return(<div>hallo</div>)
  }
}
export default InputWords;