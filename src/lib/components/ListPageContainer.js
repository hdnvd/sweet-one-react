/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
export default class ListPageContainer extends React.Component {
  render() {
    return (
        <div className={'page'}>
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

