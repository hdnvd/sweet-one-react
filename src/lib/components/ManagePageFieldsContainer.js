/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
export default class ManagePageFieldsContainer extends React.Component {
  render() {
      const propsChildren=this.props.children;
      let children=[];
      const size=this.props.cols||2;
      let rowNum=0;
      const colSize=12/size;
      let skipedItemsBeforeCurrentRow=0;
      for(let i=0;propsChildren!=null && i<propsChildren.length;i+=size){
          let row=[];
          let skipedItems=0;
          let colweight=1;
          for(let j=0;(j-skipedItems)<size && i+j+skipedItemsBeforeCurrentRow<propsChildren.length;j+=colweight){
              console.log(j);
              const theChild=propsChildren[i+j+skipedItemsBeforeCurrentRow];
              if(theChild && theChild.props!=null){
                  colweight=1;
                  if(theChild.props.colweight!=null){
                      colweight=theChild.props.colweight;
                  }
                  row[row.length]=<MDBCol md={colSize*colweight}>{theChild}</MDBCol>;
              }
              else
                  skipedItems++;
          }
          skipedItemsBeforeCurrentRow+=skipedItems;
          children[rowNum]=<MDBRow className="row">{row}</MDBRow>;
          rowNum++;
      }
    return (<MDBContainer>{children}</MDBContainer>);
  }
}

