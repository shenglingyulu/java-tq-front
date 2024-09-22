import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: JSON.parse(
      localStorage.getItem("loginUser") ||
        JSON.stringify({
          userName: "未登录",
          userRole: ACCESS_ENUM.NOT_LOGIN, // 初始化时为未登录状态
        })
    ),
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      try {
        // 从远程请求获取登录信息
        const res = await UserControllerService.getLoginUserUsingGet();
        if (res.code === 0) {
          commit("updateUser", res.data);
        } else {
          commit("updateUser", {
            ...state.loginUser,
            userRole: ACCESS_ENUM.NOT_LOGIN,
          });
        }
      } catch (error) {
        console.error("获取登录信息失败", error);
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
      // 将更新后的用户信息保存到 localStorage
      localStorage.setItem("loginUser", JSON.stringify(payload));
    },
  },
} as StoreOptions<any>;
