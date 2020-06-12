/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
export default class ManagePageContainer extends React.Component {
  render() {
      const className='page '+(this.props.className || '');
    return (
        <div className={className}>
        <p className='h5 pagetitle'>{this.props.title}</p>
            <div className={'pagecontentcontainer'}>
        <MDBContainer>
            <MDBRow>
                <MDBCol md='12'>
                    <form>
                        {this.props.children}
                    </form>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
            </div>
        </div>);
  }
}

