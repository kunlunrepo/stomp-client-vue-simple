import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入UI
import "ant-design-vue/dist/antd.css";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Layout,
  Menu,
  Table,
  RadioButton,
  RadioGroup,
  Radio,
  Tag,
} from "ant-design-vue";

var simpleApp = createApp(App);

// 注册UI组件
simpleApp.use(Layout);
simpleApp.use(Menu);
simpleApp.use(Breadcrumb);
simpleApp.use(Form);
simpleApp.use(Input);
simpleApp.use(Button);
simpleApp.use(Table);
simpleApp.use(RadioButton);
simpleApp.use(RadioGroup);
simpleApp.use(Radio);
simpleApp.use(Tag);

// 组件挂载
simpleApp.use(router).use(store).mount("#app");
