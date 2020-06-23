import AccessManager from "../classes/AccessManager";
import * as React from "react";
import {Common} from "sweet-react-common-tools";

export default class SweetListPage extends React.Component {
    moduleName=null;
    tableName=null;
    getDefaultPageSize(){
        return global.DefaultPageSize;
    }
    canInsert(){
        return  AccessManager.UserCan(this.moduleName, this.tableName, AccessManager.INSERT);
    }
    canEdit(){
        return  AccessManager.UserCan(this.moduleName, this.tableName, AccessManager.EDIT);
    }
    canDelete(){
        return  AccessManager.UserCan(this.moduleName, this.tableName, AccessManager.DELETE);
    }
    searchData=(searchParams)=>
    {
        this.LoadData(this.state.pageSize,1,null,Common.ObjectToIdValueArray(searchParams));
    };
    getPageCount(RecordCount,PageSize){
        return Math.ceil(RecordCount/PageSize);
    }
    __defaultFilters=[];
    LoadData(pageSize,page,sorted,filtered) {
        // console.log(filtered);
        let finalFilter=[];
        if(filtered!=null && filtered.length>0)
            finalFilter=finalFilter.concat(filtered);
        // console.log(finalFilter);
        if(this.__defaultFilters!=null && this.__defaultFilters.length>0)
            finalFilter=finalFilter.concat(this.__defaultFilters);
        // console.log(finalFilter);
        this.entity.getAll(pageSize, page, sorted, finalFilter, (data,RecordCount) => {
            let Pages = this.getPageCount(RecordCount, pageSize);
            // console.log(data);
            this.setState({data: this.normalizeAllListItems(data), pages: Pages})
        });
    }
    normalizeAllListItems(data){
        for(let i=0;i<data.length;i++)
            data[i]=Common.convertNullKeysToEmpty(data[i]);
        return data;
    }
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pages:1,
            page:0,
            pageSize:this.getDefaultPageSize(),
        };
    };
    componentDidMount() {
    }
}
