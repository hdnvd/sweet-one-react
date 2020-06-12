/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {SweetButton} from "sweet-react-components";
export default class ManagePageManagementBar extends React.Component {
  render() {
    return (
        <div className='text-center'>
            {this.props.canEdit && <SweetButton value={'ذخیره'} onButtonPress={this.props.onSave}/>}
            <SweetButton value={'برگشت'} onButtonPress={this.props.onBack} />
        </div>);
  }
}

