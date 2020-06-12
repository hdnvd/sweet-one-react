import AccessManager from "../classes/AccessManager";
import * as React from "react";
import ManagePageManagementBar from "../components/ManagePageManagementBar";

export default class SweetManagePage extends React.Component {
    moduleName=null;
    tableName=null;
    canEdit(){
        return  AccessManager.UserCan(this.moduleName, this.tableName, this.getID() > 0 ? AccessManager.EDIT : AccessManager.INSERT);
    }

    notifyFormDataChanged(){
        this.setState({formData:this.state.formData});
    }
    loadSimpleFields(){
        this.state.formData.getSimpleFields(()=>{
            this.notifyFormDataChanged();
        });
    }
    returnBack(){
        if(this.props!=null)
            this.props.history.push('/'+this.moduleName+'/'+this.tableName);
        else
            console.log('this.props is null');
    }
    changeFormDataItemValue(formData,name,value){
        let newData=formData;
        newData[name]=value;
        // console.log(newData);
        this.setState({formData:newData});
        return newData;
    }
    getSaveAndBackButtons(){
        return <ManagePageManagementBar onSave={
            (OnEnd)=>{this.state.formData.save(this.getID(),res=>{
                OnEnd();
            return this.returnBack();
            },OnEnd)}} onBack={()=>this.returnBack()}
            canEdit={this.state.canEdit}
        />;
    }
    getID(){
        return this.props.match.params.id;
    }
    getOnTextChangeListener(name){
        return this.getOnValueChangeListener(name);
    }
    getOnValueChangeListener(name){

        return value=>{this.changeFormDataItemValue(this.state.formData,name,value);}
    }
    getOnFidValueChangeListener(name){

        return value=>{
            let newData=this.state.formData;
            newData[name].id=value;
            this.setState({formData:newData});
            return newData;
        }
    }
    getOnFilePathChanged(name){
        return (path) => {
            let newData=this.state.formData;
            let item=newData[name];
            console.log(name);
            console.log(newData);
            if(item!=null){
                item.path=path;
                this.setState({formData:newData});
            }
        }
    }
    getOnImagePreviewLoaded(name){
        return (result) => {
            let newData=this.state.formData;
            newData[name].url= [result];
            this.setState({formData:newData});
        }
    }
    componentDidMount() {
    }
}
