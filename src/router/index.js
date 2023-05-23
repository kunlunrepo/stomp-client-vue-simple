import { createRouter, createWebHashHistory } from "vue-router";
import SimpleLayout from "@/views/SimpleLayout.vue";
import SingleReceipt from "@/views/SingleReceipt.vue";
import MultiSendReceipt from "@/views/MultiSendReceipt.vue";
import SingleSendReceipt from "@/views/SingleSendReceipt.vue";

const routes = [
  {
    path: "/",
    name: "simpleLayout",
    component: SimpleLayout,
  },
  {
    path: "/single-send-receipt",
    name: "SingleSendReceipt",
    component: SingleSendReceipt,
  },
  {
    path: "/single-receipt",
    name: "SingleReceipt",
    component: SingleReceipt,
  },
  {
    path: "/multi-send-receipt",
    name: "MultiSendReceipt",
    component: MultiSendReceipt,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
