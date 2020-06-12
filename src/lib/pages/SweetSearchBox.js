import * as React from "react";

export default class SweetSearchBox extends React.Component {
    moduleName=null;
    tableName=null;
    entity=null;
    loadSimpleFields(){
            this.state.formData.getSimpleFields(()=>{
            this.notifyFormDataChanged();
        });

    }
    componentDidMount() {
    }

    notifyFormDataChanged(){
        this.setState({formData:this.state.formData});
    }
    changeSearchParamsItemValue(searchParams,name,value){
        let newData=searchParams;
        newData[name]=value;
        this.setState({searchParams:newData});
        return newData;
    }
    getOnConfirm(){
        return ()=>this.props.onConfirm(this.state.searchParams);
    }
    getOnTextChangeListener(name){
        return this.getOnValueChangeListener(name);
    }
    getOnValueChangeListener(name){

        return value=>{this.changeSearchParamsItemValue(this.state.searchParams,name,value);}
    }
    getOnFidValueChangeListener(name){

        return this.getOnValueChangeListener(name);
    }
    lastSearchParams={};
    notifyParamsChange(){
        if(this.state.searchParams!==this.lastSearchParams) {
            this.props.onSearchParamsChange(this.state.searchParams);
            this.lastSearchParams = this.state.searchParams;
        }
    }
}
