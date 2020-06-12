// @flow
import Constants from "./Constants";
import {Common,SweetAlert} from "sweet-react-common-tools";
import axios from 'axios';
import  Cookies  from './Cookies';

class SweetFetcher {
    static METHOD_GET='get';
    static METHOD_POST='post';
    static METHOD_PUT='put';
    static METHOD_DELETE='delete';
    cookies = new Cookies().cookies;
    Fetch(URL,Method,PostingData,AfterFetchFunction,OnErrorFunction,ServiceName,ActionName,history){
        Method=Method.toString().trim().toLowerCase();
        let PostData=null;
        if(PostingData!=null)
        {
            if(global.ServerMode===Constants.SERVERMODE_LARAVEL)
            {
                if(Method==="put")
                {
                    PostingData.append('_method', 'put');
                    Method=SweetFetcher.METHOD_POST;
                }
                PostData=PostingData;
            }
            else if(global.ServerMode===Constants.SERVERMODE_ASP)
            {
                PostData=new URLSearchParams(PostingData);
            }
        }
        let Fetched=null;
        let Prefix='';
        if(global.ServerMode===Constants.SERVERMODE_LARAVEL)
            Prefix='Bearer ';
        // console.log(cookies.get('userdisplayname'));
        // console.log(this.cookies.get('sessionkey'));
        let ax=axios.create({
            baseURL: global.SiteURL+"/api",
            headers: {
                Accept: 'application/json',
                Authorization: Prefix+this.cookies.get('sessionkey'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // mode: 'cors',
            // crossDomain:true,
        });
        if(Method===SweetFetcher.METHOD_GET)
        {
            Fetched=ax.get(URL);
        }
        else if(Method===SweetFetcher.METHOD_POST)
        {
            Fetched=ax.post(URL,PostData);
        }
        else if(Method===SweetFetcher.METHOD_PUT)
        {
            Fetched=ax.put(URL,PostData);
        }
        else if(Method===SweetFetcher.METHOD_DELETE)
        {
            Fetched=ax.delete(URL);
        }
        Fetched.then(response => {
                try {
                    console.log("URL:"+URL);
                    console.log(response);
                }catch (e) {

                }

                    let data=response.data;
                    if(data!=null)
                    {
                        console.log(data);
                        if(Array.isArray(data.Data))
                        {
                            for(let i=0;i<data.Data.length;i++)
                            {
                                data.Data[i]=Common.convertObjectPropertiesToLowerCase(data.Data[i]);
                            }
                        }
                        else if(data.Data!=null)
                        {
                            data.Data=Common.convertObjectPropertiesToLowerCase(data.Data);
                        }
                        AfterFetchFunction(data);
                    }

            }).catch(function (error) {
                if(error.response!=null)
                {
                    const response=error.response;
                    const status=response.status;
                    if (status!==200 && status!==201  && status!==202 && status!==203) {

                        if(OnErrorFunction!=null)
                            OnErrorFunction(error);
                        console.log(status);
                        if(status.toString().trim()==="403")
                            SweetAlert.displayErrorAlert("خطای دسترسی", 'شما دسترسی لازم برای اجرای این کار را ندارید');
                        if(status.toString().trim()==="401")
                            SweetAlert.displayErrorAlert("خطای اطلاعات کاربری", 'اطلاعات کاربری صحیح نمی باشد');
                        if(status.toString().trim()==="405")
                            SweetAlert.displayAccessDeniedAlert();
                        if(status.toString().trim()==="429")
                            SweetAlert.displayErrorAlert("خطای محافظت امنیتی",'تعداد درخواست های شما بیش از حد مجاز است و به دلایل امنیتی دسترسی شما تا چند دقیقه بعد مسدود شد. لطفا چند دقیقه دیگر مراجعه نمایید');
                        if (status.toString().trim() === "422")
                        {
                            if (OnErrorFunction != null)
                                OnErrorFunction(error);
                            let displayDefaultMessage=true;
                            if(response.hasOwnProperty('data')) {
                                let data = response.data;
                                if(data.hasOwnProperty('errors') && data.errors!=null)
                                {
                                    displayDefaultMessage=false;
                                    let message='';
                                    // SweetConsole.log(data.errors);
                                    Object.keys(data.errors).forEach(function(key, index) {
                                        let item=data.errors[key];
                                        Object.keys(item).forEach(function(key, index) {
                                            let itemMessage=item[key];
                                            // message=message+"<p>"+itemMessage+"</p>";
                                            message="<p>"+itemMessage+"</p>";
                                        });
                                    });
                                    SweetAlert.displayWarningAlert("خطای اطلاعات ورودی",message);

                                }
                                else if (data.hasOwnProperty('message'))
                                {
                                    displayDefaultMessage=false;
                                    if(data.message!=='')
                                        SweetAlert.displayWarningAlert("خطای اطلاعات ورودی",data.message);

                                }
                            }
                            if(displayDefaultMessage)
                                SweetAlert.displayWarningAlert("خطای اطلاعات ورودی", 'لطفا اطلاعات را به صورت صحیح وارد کنید');

                        }
                        else if (status.toString().trim() === "500")
                        {
                            if (OnErrorFunction != null)
                                OnErrorFunction(error);
                            let displayDefaultMessage=true;
                            console.log(response);
                            let data = response.data;
                            if (Constants.Debugging && data.hasOwnProperty('message'))
                            {
                                displayDefaultMessage=false;
                                if(data.message!=='')
                                    SweetAlert.displayErrorAlert("خطای سرور",data.message);
                            }
                            if(Constants.Debugging && displayDefaultMessage)
                                SweetAlert.displayErrorAlert("خطای سرور", 'خطایی در سمت سرور رخ داد، لطفا این مشکل را به پشتیبانی اطلاع دهید.');
                        }
                    }
                }

            console.log(error.response);
            console.log(error);
        });
    }
}

export default SweetFetcher;
