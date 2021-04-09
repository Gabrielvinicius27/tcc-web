import React, { Component, useEffect } from 'react'
import tableau from "tableau-api";

class Test extends Component {
    componentDidMount() {
      this.initViz()
    }
   
    initViz() {
      const vizUrl = 'https://public.tableau.com/views/MonitoramentoTemperaturaEstoqueCefsa/Painel1?:language=pt&:display_count=y&:origin=viz_share_link';
      const vizContainer = this.vizContainer;
      let viz = new window.tableau.Viz(vizContainer, vizUrl)
    }
   
    render() {
      return (
        <div ref={(div) => { this.vizContainer = div }}>
        </div>
      )
    }
  }
   
   
export default Test;