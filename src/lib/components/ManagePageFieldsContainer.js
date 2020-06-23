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
      const colSize=12/size;
      let checkedItems=0;
      if(propsChildren!=null) {
          const childCount = propsChildren.length;
          for (let rowNum = 0; checkedItems < childCount; rowNum++) {
              let row = [];
              for (let rowColSum = 0; checkedItems < childCount && rowColSum < size; checkedItems++) {
                  const theChild = propsChildren[checkedItems];
                  if (theChild && theChild.props != null) {
                      const colWeight = theChild.props.colweight || 1;
                      row[row.length] = <MDBCol md={colSize * colWeight}>{theChild}</MDBCol>;
                  }
              }
              children[rowNum] = <MDBRow className="row">{row}</MDBRow>;
          }
      }
    return (<MDBContainer>{children}</MDBContainer>);
  }
}

