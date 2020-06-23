// @flow
import SweetHttpRequest from "../classes/sweet-http-request";
import {Common} from "sweet-react-common-tools";
import SweetFetcher from "../classes/sweet-fetcher";
import AccessManager from "../classes/AccessManager";
export default class SweetEntity{
    __moduleName=null;
    __tableName=null;
    simpleFields={};
    _isSimpleFieldsLoaded=false;
    constructor() {
        this._initializeSimpleFields();
    }
    getBaseURL(){
        return '/'+this.__moduleName+'/'+this.__tableName;
    }
    getServiceName(){
        return this.__moduleName+'.'+this.__tableName;
    }
    fields={};
    getFieldType(theField){
        if(theField.type!=null)
            return theField.type;
        return 'text;'
    }
    getSimpleFields(afterfetch,onError){
        if(!this._isSimpleFieldsLoaded){
            this._loadSimpleFields(afterfetch,onError);
        }
        else {
            afterfetch();
        }
    }
    _loadSimpleFields(afterfetch,onError){
            new SweetFetcher().Fetch('common/fieldvalue/byfield?fields='+this._getSimpleFieldNamesSTR(),SweetFetcher.METHOD_GET,null,
                res => {
                    let allSimpleFields=res.Data;

                    let keys = Object.keys(allSimpleFields);
                    let length= keys.length;
                    for(let i=0;i<length;i++){
                        const key=keys[i];
                        allSimpleFields[key]=allSimpleFields[key].Data;
                    }
                    this.simpleFields=res.Data;
                    afterfetch();
                },(error)=>{if(onError!=null) onError(error)},
                'common.fieldvalue',
                AccessManager.LIST);

    }
    _initializeSimpleFields(){
        let keys = Object.keys(this.fields);
        let length= keys.length;
        for(let i=0;i<length;i++){
            const field=this.fields[keys[i]];
            if(field.type==='simplefield'){
               this.simpleFields[field.simplefieldname]=[];
            }
        }
    }
    _getSimpleFieldNamesSTR(){
        let str="";
        let keys = Object.keys(this.fields);
        let length= keys.length;
        for(let i=0;i<length;i++){
            const field=this.fields[keys[i]];
            if(field.type==='simplefield'){
                if(str!=="")
                    str+=',';
                str+=field.simplefieldname;
            }
        }
        return str;
    }
    loadFromRetrievedObject(theObject){
        let keys = Object.keys(this.fields);
        let n = keys.length;
        while (n--) {
            let DisplayName=keys[n];//documentImage
            const theField=this.fields[DisplayName];
            let fieldName=theField.field;//doc_igu
            const fieldType=this.getFieldType(theField);
            if(fieldType==='file'){
                if(theObject[fieldName]!=null && theObject[fieldName].trim().length>0)
                    this[DisplayName] = {url:global.SiteURL+"/"+theObject[fieldName]};
                else
                    this[DisplayName] = {url:null};
            }
            else if(fieldType==='entity'){
                if(theObject[fieldName]!=null){
                    theField.object.loadFromRetrievedObject(theObject[fieldName]);
                    this[DisplayName]=theField.object;
                }
            }
            else if(fieldType==='entityarray'){
                if(theObject[fieldName]!=null){
                    const data=theObject[fieldName];
                    let array=[];
                    for(let dataItem of data){
                        let obj=this.clone(theField.object);
                        obj.loadFromRetrievedObject(dataItem);
                        array[array.length]=obj;
                    }

                    this[DisplayName]=array;
                }
            }
            else
                this[DisplayName] = theObject[fieldName];
        }
    }
    clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        let copy = new obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
    getFormRequest(){
        // console.log(this);
        let keys = Object.keys(this.fields);
        let n = keys.length;
        const data = new FormData();
        while (n--) {
            let DisplayName=keys[n];//documentImage
            const theField=this.fields[DisplayName];
            let fieldName=theField.field;//doc_igu
            const fieldType=this.getFieldType(theField);
            if(fieldType==='file') {
                console.log(fieldName+":"+this[DisplayName].path);
                data.append(fieldName, this[DisplayName].path);
            }
            else if(fieldType==='fid') {
                console.log(fieldName+":"+DisplayName+":"+this[DisplayName].id);
                data.append(fieldName, this[DisplayName].id);
            }
            else if(fieldType==='entityarray'){
                data.append(fieldName, JSON.stringify(this[DisplayName]));
            }
            else if(fieldType==='simplefield') {
                console.log(fieldName+":"+this[DisplayName].id);
                data.append(fieldName, this[DisplayName].id);
            }
            else {
                console.log(fieldName+":"+this[DisplayName]);
                data.append(fieldName, this[DisplayName]);
            }
        }
        console.log(data);
        return data;
    }
    _get(url,ServiceName,actionName,afterFetch){
        new SweetFetcher().Fetch(url, SweetFetcher.METHOD_GET,null,
            data => {
                data.Data=Common.convertNullKeysToEmpty(data.Data);
                this.loadFromRetrievedObject(data.Data);
                afterFetch();
            },
            null,ServiceName,actionName,
            null);
    }
    getFilterString(pageSize,page,sorted,filtered){
        let Request=new SweetHttpRequest();
        if(filtered!=null)
            Request.appendVariables(filtered,'id','value');
        if(sorted!=null)
            Request.appendVariablesWithPostFix(sorted,'id','desc','__sort');
        if(pageSize!=null && page!=null) {
            let RecordStart=((page-1)*pageSize);
            Request.appendVariable('__pagesize', pageSize);
            Request.appendVariable('__startrow', RecordStart);
        }
        let filterAndSortString=Request.getParamsString();
        if(filterAndSortString!='') filterAndSortString='?'+filterAndSortString;
        return filterAndSortString;
    }
    _getAll(url,ServiceName,actionName,afterFetch,onError){
        new SweetFetcher().Fetch(url, SweetFetcher.METHOD_GET, null,
            data => {
                let objects=[];
                for(let i=0;i<data.Data.length;i++) {
                    data.Data[i] = Common.convertNullKeysToEmpty(data.Data[i]);
                    objects[i]=new this.constructor();
                    objects[i].loadFromRetrievedObject(data.Data[i]);
                }
                afterFetch(objects,data.RecordCount);
            },
            onError,ServiceName,actionName,null);
    }
    getAll(pageSize,page,sorted,filtered,afterFetch,onError){}
    _save(ServiceName,url,id,formData,afterFetchListener,onError){
        let method=SweetFetcher.METHOD_POST;
        let action=AccessManager.INSERT;
        if(id!=null && id!=='' && id>0){
            method=SweetFetcher.METHOD_PUT;
            action=AccessManager.EDIT;
            url=url+'/'+id;
            formData.append('id', id);
        }
        new SweetFetcher().Fetch(url,method,formData,
            res => {
                afterFetchListener(res);
            },onError,
            ServiceName,action,
            null);

    }
    _delete(ServiceName,url,afterFetchListener,onError){
            new SweetFetcher().Fetch(url, SweetFetcher.METHOD_DELETE, null,
                data => {
                    afterFetchListener(data);
                },(error)=>{
                    onError(error);
                },ServiceName,AccessManager.DELETE,null);
    }
}
