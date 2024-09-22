<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" />
            <div class="title">Java OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="50px">
      <img
        v-if="store.state.user.loginUser.userAvatar"
        style="left: auto"
        :src="store.state.user.loginUser.userAvatar"
        width="50px"
        height="50px"
      />
      <img
        v-else
        style="left: auto"
        src="../assets/logo.png"
        width="50px"
        height="50px"
        alt="Default Avatar"
      />
    </a-col>
    <a-col flex="100px">
      <div>
        <!-- 使用 a-dropdown 组件实现可点击的下拉菜单 -->
        <a-dropdown trigger="click">
          <a-button type="text">
            <!-- 显示用户名或“未登录” -->
            {{ store.state.user?.loginUser?.userName ?? "未登录" }}
            <a-icon-down />
          </a-button>
          <!-- 下拉菜单内容 -->
          <template #content>
            <a-menu>
              <a-menu-item key="profile" @click="goToProfile"
                >个人中心</a-menu-item
              >
              <a-menu-item key="logout" @click="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

console.log(
  "store.state.user.loginUser: ",
  store.state.user.loginUser.userRole
);

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
/**
 * 跳转到个人中心
 */
const goToProfile = () => {
  router.push("/profile");
};

/**
 * 退出登录
 */
const logout = async () => {
  // 调用后台 API 进行退出登录处理 (例如 UserControllerService.userLogoutUsingPost())
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code == 0) {
    await store.dispatch("user/logout");
    message.success("已退出登录");
    router.push("/user/login");
  } else {
    message.error("退出登录失败");
  }
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
