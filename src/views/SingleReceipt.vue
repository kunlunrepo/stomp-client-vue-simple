<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div :style="{ display: 'flex', marginBottom: '1rem' }">
      <a-tag color="processing">
        <template #icon>
          <sync-outlined :spin="true" />
        </template>
        【接收】频道
      </a-tag>
      <a-radio-group v-model:value="selectedChannel" @change="hdlRadioChange">
        <a-radio
          v-for="item in commChannels"
          :value="item.key"
          :key="item.key"
          >{{ item.value }}</a-radio
        >
      </a-radio-group>
    </div>
    <div :style="{ display: 'flex', flexDirection: 'row' }">
      <div :style="{ display: 'flex', width: '100%' }">
        <a-table
          :style="{ width: '100%' }"
          :columns="tableColumns"
          :data-source="tableData"
        ></a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import Sockjs from "sockjs-client";
import { Stomp } from "stompjs/lib/stomp";
import { message } from "ant-design-vue";

export default defineComponent({
  // 组件名称
  name: "singleReceipt",
  // 导入组件
  components: {},
  setup() {
    // 定义变量
    let socket = null;
    let stompClient = null;
    const tableColumns = [
      {
        title: "发送方",
        dataIndex: "sendName",
        key: "sendName",
      },
      {
        title: "接收方",
        dataIndex: "receiptName",
        key: "receiptName",
      },
      {
        title: "内容",
        dataIndex: "sendMsg",
        key: "sendMsg",
      },
      {
        title: "发送时间",
        dataIndex: "sendTime",
        key: "sendTime",
      },
    ];
    const tableData = ref([]);
    const commChannels = ref([]); // 通信频道组
    const selectedChannel = ref("1"); // 选中通信频道
    const lastReceiptChannel = ref(""); // 上一次接收频道
    // 生命周期函数
    onMounted(() => {
      // console.log("sockjs组件初始化", Sockjs, Stomp.over());
      initConn();
      initClient();
    });
    onUnmounted(() => {
      disConn();
    });
    // 初始化连接
    const initConn = () => {
      socket = new Sockjs("http://localhost:9000/stomp-server");
    };
    // 初始化Stomp协议客户端
    const initClient = () => {
      stompClient = Stomp.over(socket);
      stompClient.connect({}, (framne) => {
        console.log("客户端：", framne);
        subSingle();
        getChannels(stompClient);
      });
    };
    // 销毁Stomp协议客户端
    const disConn = () => {
      if (null != stompClient) {
        stompClient.disconnect();
      }
    };
    // 获取通信频道
    const getChannels = (client) => {
      client.send("/client-channel", {}, null);
      client.subscribe("/server-send/channel", (result) => {
        console.log("订阅结果：", result);
        message.success("通道初始化完成", 1);
        if (result.body !== null) {
          let channels = JSON.parse(result.body);
          if (null != channels) {
            commChannels.value = [];
            for (let i = 0; i < channels.length; i++) {
              commChannels.value.push({
                key: channels[i].channelId,
                value: channels[i].channelName,
              });
            }
          }
        }
      });
    };
    // 处理频道选择事件
    const hdlRadioChange = () => {
      console.log("频道选择事件");
      if ("" !== lastReceiptChannel.value) {
        unSubSingle(lastReceiptChannel.value);
      }
      lastReceiptChannel.value = selectedChannel.value;
      subSingle(selectedChannel.value);
    };
    // 订阅单人通信
    const subSingle = (channel) => {
      if (null !== channel && "" !== channel) {
        stompClient.subscribe(
          "/server-send-single/" + channel + "/",
          (result) => {
            console.log("订阅结果：", result);
            message.success("收到一条消息，请查看", 1);
            if (result.body !== null) {
              let pushData = JSON.parse(result.body);
              tableData.value.push(pushData.data);
              console.log(pushData);
            }
          }
        );
      }
    };
    // 取消订阅单人通信
    const unSubSingle = (channel) => {
      if (null !== channel && "" !== channel) {
        stompClient.unsubscribe(channel); // 填充的是id
        console.log("取消订阅");
      }
    };

    return {
      commChannels,
      selectedChannel,
      hdlRadioChange,
      tableColumns,
      tableData,
    };
  },
});
</script>
