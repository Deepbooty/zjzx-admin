require.config({
    waitSeconds:0,
    paths:{
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min"

    },
    shim: {
    },
});

define(["Vue","Vuex"],function(Vue,Vuex){
    Vue.use(Vuex);


//初始化变量
    let state = {
        token:window.localStorage.getItem('token'),
        id:null,
        logid:null,
        username:null

    }
//创建改变状态的方法
    const mutations = {
        LOGIN(state,data) {
            state.token = data;
            window.localStorage.setItem('token', data);
        },
        LOGOUT(state) {
            state.token = null;
            window.localStorage.removeItem('token');
        },
        ID(state,data) {
            state.id = data;
            window.localStorage.setItem('id', data);
        },
        LOGID(state, data) {
            state.logid=data;
            window.localStorage.setItem('logid', data);
        },
        USERNAME(state,data) {
            state.username = data;
            window.localStorage.setItem('userName',data);
        }

    }
//创建驱动action可以使得mutations得
    const actions = {
        UserLogin({commit}, data) {
            commit('LOGIN',data);
        },
        UserLogout({commit}) {
            commit('LOGOUT');
        },
        UserId({commit}, data) {
            commit('ID', data);
        },
        UserLogid({commit},data) {
            commit('LOGID', data);
        },
        UserName({commit},data) {
            commit('USERNAME',data);
        }
    }

    let Store = new Vuex.Store({
        state,
        mutations,
        actions
    });
    return Store;


});
