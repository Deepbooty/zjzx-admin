require.config({
    waitSeconds:0,
    paths:{
        "userService":CONST.cdnpath+"/Backstage/service/userService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "Tool":CONST.cdnpath+"/Backstage/js/methods",

    },
    shim: {
    },
});
define(["userService","Vue","Store","Tool"],function(userService,Vue,Store,Tool){
    // debugger;
    let vm = new Vue({
        el:"#loginApp",
        data:{
            mobile:"",
            code:"",
            codeText:"获取验证码",
            maxCode:4,
            maxlength:11,
            mobileError:"",
            codeError:"",
            codeTimer:null,
            disabled:true,
            color:false,
        },
        computed:{
            //检测是否错误
            mobileErr(){
                return !Tool.isPhoneNumber(this.mobile.replace(/\s/g,""));
            },
            codeColor(){
                if(this.mobile.length != this.maxlength) {
                    this.disabled = true;
                    this.color = false;
                }else{
                    this.disabled = false;
                    this.color = true;
                }
            }
        },
        created(){
        },
        methods:{
            codeInput(){
                vm.code = vm.code.replace(/[^0-9]/g,'');
                console.log(vm.code)
            },
            getCode(){
                if(vm.codeTimer) {return}
                if(this.mobileErr){vm.mobileError="请填写正确的手机号";return;}
                // debugger;
                let mobile = vm.mobile;
                let resMap = userService.getCode(mobile);
                vm.code = resMap.result.code;
                if(resMap.status == "success") {
                    vm.codeText='60秒后重发';
                    vm.disabled = true;
                    let i = 60;
                    vm.codeTimer = setInterval(()=>{
                        if(i>0) {
                            i--;
                            vm.codeText = i + '秒后重发';
                        }else {
                            clearInterval(vm.codeTimer);
                            vm.codeTimer = null;
                            vm.codeText = "获取验证码";
                            vm.disabled = false;
                        }
                    },1000);
                }
            },
            login(){

                if(this.mobileErr){vm.mobileError="请填写正确的手机号";return;}else{
                    vm.mobileError='';
                }

                let resMap = userService.loginByMobile(vm.mobile,vm.code);
                if(resMap.status == "success") {
                    let token = resMap.result.token;
                    let id = resMap.result.user.id;
                    let logid = resMap.result.user.logid;
                    Store.dispatch('UserLogin',token);
                    Store.dispatch('UserId',id);
                    Store.dispatch('UserLogid',logid);
                    localStorage.userData = JSON.stringify(resMap.result.user);
                    console.log(localStorage.userData);
                    layer.msg('登录成功', {icon: 1});
                    setTimeout(()=>{
                        window.location.href= CONST.cdnpath+"/Backstage/pages/admin/admin.html";
                    },1800);

                }
                if(resMap.status == "error") {
                    vm.code ="";
                    vm.codeError = resMap.result.tip;
                }else {
                    vm.codeError ="";
                    return;
                }
            }
        }

    });

});