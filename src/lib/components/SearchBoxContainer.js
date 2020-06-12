/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
export default class SearchBoxContainer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isOpen:false,
        }
    }

    toggleSearchWindow = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
  render() {
      const onConfirm=this.props.onConfirm;
      const toggle=this.toggleSearchWindow;
      const isOpen=this.state.isOpen;
      let toggleButton=<MDBBtn onClick={toggle}>جستجو</MDBBtn>;
      if(this.props.toggleButton!=null)
          toggleButton=this.props.toggleButton(toggle);
    return (<MDBContainer className={'searchcontainer'}>
        {toggleButton}
        <MDBModal isOpen={isOpen} toggle={toggle}>
            <MDBModalHeader toggle={toggle}>{this.props.title||'جستجو'}</MDBModalHeader>
            <MDBModalBody>
                <form>
                    {this.props.children}
                </form>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn color='secondary' onClick={toggle}>{this.props.closeTitle||'بستن'}</MDBBtn>
                <MDBBtn color='primary' onClick={()=> {
                    onConfirm();
                    toggle();
                }
                }>{this.props.confirmTitle||'جستجو'}</MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    </MDBContainer>);
  }
}

