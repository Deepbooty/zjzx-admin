require.config({
    waitSeconds:0,
    paths:{
        "userService":CONST.cdnpath+"/Backstage/service/userService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Store":CONST.cdnpath+"/Backstage/store/index"

    },
    shim: {
    },
});
define(["userService","Vue","Store"],function(userService,Vue,Store){
    // debugger;
    let vm = new Vue({
        el:"#adminApp",
        data:{
            username:'',



            src:CONST.cdnpath+"/Backstage/pages/articelManager/articelManager.html",

            navList:[
                {id: 1, icon:'icon-shenhe', text:'文章编辑'},
                {id: 2, icon:'icon-moban', text:'文章模板'},
                {id: 3, icon:'icon-daoru', text:'文章导入'},
                {id: 4, icon:'icon-news', text:'新闻资讯'},
                {id: 5, icon:'icon-edit', text:'用户反馈'},
                {id: 6, icon:'icon-liuyan', text:'在线留言'},
                {id: 7, icon:'icon-icon_tip_off', text:'用户举报'},
                {id: 8, icon:'icon-zhanghuyichang', text:'网页异常'}
            ],
            num:null,
        },
        created(){
            this.$nextTick(()=>{

                let userData=null;
                let token = localStorage.getItem('token');
                if(token) {
                    userData = JSON.parse(localStorage.userData);
                    if(userData.username == "") {
                        vm.username = userData.mobile;
                    }else {
                        vm.username = userData.username;
                    }
                }
            })
        },
        methods:{
            // 退出登录
            signOut(){
                let data = userService.logOut();
                // if(data.status == 'success') {
                //     layer.confirm('确定退出登录？', {
                //         btn: ['退出登录','取消'] //按钮
                //     }, function(){
                //         layer.msg('退出成功', {icon: 1});
                // console.log(data)
                Store.dispatch('UserLogout');
                window.location.href = CONST.cdnpath+"/Backstage/pages/login/login.html"
                //     });
                // }
            },
            handelIndex(index){
                vm.num = index;
                if(index == 0) {
                    vm.src= CONST.cdnpath+"/Backstage/pages/articelManager/articelManager.html"
                }
                else if(index == 1) {
                    vm.src = CONST.cdnpath+"/Backstage/pages/templateManager/templateManager.html"
                }
                else if (index == 2) {
                    vm.src = CONST.cdnpath+"/Backstage/pages/articelImport/articelImport.html"
                }else if(index == 3) {
                    vm.src = CONST.cdnpath+"/Backstage/pages/newsInfo/newsInfo.html"
                }
                else if(index == 4) {
                    vm.src = CONST.cdnpath+"/Backstage/pages/userFeedback/userFeedback.html"
                }
                else if(index == 5) {
                    vm.src = CONST.cdnpath+"/Backstage/pages/onlineMessage/onlineMessage.html"
                }
            },

        }
    });

});