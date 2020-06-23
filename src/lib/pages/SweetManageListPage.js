
import * as React from "react";
import {FaEdit, IoMdAddCircle, IoMdEye, MdDeleteForever} from "react-icons/all";
import {SweetAlert} from "sweet-react-common-tools";
import {Link} from "react-router-dom";
import {SweetTable} from "sweet-react-components";
import SweetListPage from "./SweetListPage";

export default class SweetManageListPage extends SweetListPage {
    moduleName=null;
    tableName=null;
    tableClassName='-striped -highlight';

    getAddLink(){
        return '/'+this.moduleName+'/'+this.tableName+'/management';
    }
    getEditLink(id){
        return this.getAddLink()+"/"+id;
    }
    getViewLink(id){
        return '/'+this.moduleName+'/'+this.tableName+'/view/'+id;
    }
    getDeleteButton(id){
        if(this.canDelete())
        return <MdDeleteForever onClick={
            () =>{
                SweetAlert.displayDeleteAlert(()=>{
                    this.entity.delete(id,()=>{
                        this.LoadData(this.state.pageSize,this.state.page+1,null,null);
                    },null);

                });
            }
        }/>;
        return null;
    }

    getLink(to,className,childs){
        return <Link className={className} to={to}>{childs}</Link>
    }
    getAddButton(){
        return <div className={'topoperationsrow'}>{this.canInsert() && <Link to={this.getAddLink()} className={'addlink'}><IoMdAddCircle/></Link>}</div>
    }

    columns = [
        {
            Header: 'نام',
            accessor: 'name'
        },
        {
            Header: 'نام نمایشی',
            accessor: 'displayName'
        },
        {
            Header: 'عملیات',
            accessor: 'id',
            Cell: props => {this.getOperationsBox(props.value)},
        },];
    getTable(){
        return <SweetTable
            filterable={false}
            className={this.tableClassName}
            defaultPageSize={this.state.pageSize}
            data={this.state.data}
            pages={this.state.pages}
            columns={this.columns}
            excludedExportColumns={'id'}
            manual
            onFetchData={(state, instance) => {
                this.setState({loading: true,page:state.page});
                this.LoadData(state.pageSize,state.page+1,state.sorted,state.filtered);
            }}
        />
    }
    getViewButton(id){
        return  <Link className={'viewlink'} to={this.getViewLink(id)}><IoMdEye/></Link>;
    }
    getEditButton(id){
        if(this.canEdit())
            return <Link className={'editlink'}  to={this.getEditLink(id)}><FaEdit/></Link>;
        return null;
    }
    getOperationsBox(id){
        return <div className={'operationsrow'}>
            {this.getViewButton(id)}
            {this.getEditButton(id)}
            {this.getDeleteButton(id)}
        </div>
    }
}
