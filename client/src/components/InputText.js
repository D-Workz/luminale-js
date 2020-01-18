import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Button, Card} from "@blueprintjs/core";
import { fabric } from 'fabric';

class InputText extends Component {

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

  }
}
export default InputText;