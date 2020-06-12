import * as React from "react";
import SweetManagePage from "./SweetManagePage";
export default class SweetDependentManagePage  extends SweetManagePage {
    __ownerTable=null;
    returnBack(){
        if(this.props!=null)
            this.props.history.push('/'+this.moduleName+'/'+this.__ownerTable+'/'+'management/'+this.getOwnerID());
        else
            console.log('this.props is null');
    }
    getOwnerID(){
        return this.props.match.params.ownerid;
    }
}
