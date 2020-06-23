import * as React from "react";
import SweetManageListPage from "./SweetManageListPage";

export default class SweetManageDepenedentListPage extends SweetManageListPage {
    tableClassName='dependentlisttable';
    getDefaultPageSize(){
        return 5;
    }
    getOwnerID(){
        return this.props.ownerID;
    }
    getAddLink(){
        return '/'+this.moduleName+'/'+this.tableName+'/management/'+this.getOwnerID();
    }
    getEditLink(id){
        return this.getAddLink()+"/"+id;
    }
    getViewLink(id){
        return '/'+this.moduleName+'/'+this.tableName+'/view/'+this.getOwnerID()+'/'+id;
    }
}
