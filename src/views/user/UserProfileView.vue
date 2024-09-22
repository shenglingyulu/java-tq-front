<template>
  <div>
    <a-card style="width: 800px; margin-top: 20px; margin-left: 20px" hoverable>
      <a-form label-col="{ span: 4 }" wrapper-col="{ span: 16 }" :model="form">
        <!-- 用户ID（只读） -->
        <a-form-item label="头像">
          <a-space direction="vertical" :style="{ width: '100%' }">
            <a-upload
              name="file"
              list-type="picture-card"
              :show-upload-list="false"
              :with-credentials="true"
              :show-file-list="false"
              :custom-request="Onchange"
            >
              <template #upload-button>
                <div
                  v-if="form.userAvatar"
                  class="arco-upload-list-picture custom-upload-avatar"
                >
                  <img :src="form.userAvatar" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <a-progress
                    v-if="
                      file && file.status === 'uploading' && file.percent < 100
                    "
                    :percent="file.percent"
                    type="circle"
                    size="mini"
                    :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                    }"
                  />
                </div>
                <div class="arco-upload-picture-card" v-else>
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600">Upload</div>
                  </div>
                </div>
              </template>
            </a-upload>
          </a-space>
        </a-form-item>

        <!-- 用户ID（只读） -->
        <a-form-item label="用户 ID">
          <a-input v-model="form.id" disabled />
        </a-form-item>

        <!-- 用户名（只读） -->
        <a-form-item label="用户名">
          <a-input v-model="form.userName" />
        </a-form-item>

        <!-- 简介 -->
        <a-form-item label="简介">
          <a-textarea v-model="form.userProfile" rows="3" />
        </a-form-item>

        <!-- 用户角色 -->
        <a-form-item label="角色">
          <a-input
            :model-value="
              form.userRole === 'admin'
                ? '管理员'
                : form.userRole === 'user'
                ? '用户'
                : form.userProfile === 'ban'
                ? '禁用'
                : form.userProfile === 'vip'
                ? '会员'
                : form.userRole
            "
            disabled
          />
        </a-form-item>

        <!-- 创建时间（只读） -->
        <a-form-item label="创建时间">
          <a-input v-model="form.createTime" disabled />
        </a-form-item>

        <!-- 操作按钮 -->
        <a-form-item wrapper-col="{ span: 16, offset: 4 }">
          <a-button type="primary" @click="save">保存</a-button>
          <a-button @click="returnHome" style="margin-left: 10px"
            >返回主页</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  UploadControllerService,
  UserControllerService,
  UserUpdateMyRequest,
  UserVO,
} from "../../../generated";
import { useRouter } from "vue-router";
import message from "@arco-design/web-vue/es/message";
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { isSuccess } from "generated/core/request";
import { FileItem, RequestOption } from "@arco-design/web-vue/es/upload";
const form = reactive({
  id: undefined,
  userName: "",
  userAvatar: "",
  userProfile: "",
  userRole: "",
  createTime: "",
} as UserVO);

const router = useRouter();
const file = ref();
/**
 * 获取当前用户信息
 */
const loadUserProfile = async () => {
  try {
    const res = await UserControllerService.getLoginUserUsingGet();
    if (res.code === 0 && res.data) {
      Object.assign(form, res.data); // 使用接口返回的数据填充表单
    } else {
      message.error("获取用户信息失败：" + res.message);
    }
  } catch (error) {
    message.error("获取用户信息时发生错误");
  }
};

const Onchange = async (option: RequestOption) => {
  // 发送请求给后端
  const res = await UploadControllerService.uploadUsingPost(
    option.fileItem.file
  );
  if (res.code === 0) {
    form.userAvatar = res.data;
    message.success("上传成功");
    option.onSuccess(res.data);
  } else {
    message.error("上传失败" + res.message);
    option.onError(res.message);
  }
};

/**
 * 更新用户信息
 */
const save = async () => {
  try {
    const res = await UserControllerService.updateMyUserUsingPost(form);
    if (res.code === 0) {
      message.success("用户信息更新成功");
    } else {
      message.error("更新用户信息失败：" + res.message);
    }
  } catch (error) {
    message.error("更新用户信息时发生错误");
  }
};
/**
 * 页面加载时获取用户信息
 */
onMounted(() => {
  loadUserProfile();
});

const returnHome = () => {
  router.push("/");
};
</script>

<style scoped></style>
