<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div :style="{ display: 'flex', marginBottom: '1rem' }">
      <a-tag
        :style="{ width: '6rem', maxWidth: '6rem', height: '1.5rem' }"
        color="processing"
      >
        <template #icon>
          <sync-outlined :spin="true" />
        </template>
        【发送】频道
      </a-tag>
      <a-radio-group
        v-model:value="selectedSendChannel"
        @change="hdlSendChange"
      >
        <a-radio
          v-for="item in commChannels"
          :value="item.key"
          :key="item.key"
          >{{ item.value }}</a-radio
        >
      </a-radio-group>
    </div>
    <div :style="{ display: 'flex', marginBottom: '1rem' }">
      <a-tag :style="{ width: '6rem', height: '1.5rem' }" color="processing">
        <template #icon>
          <sync-outlined :spin="true" />
        </template>
        【接收】频道
      </a-tag>
      <a-radio-group
        v-model:value="selectedReceiptChannel"
        @change="hdlReceiptChange"
      >
        <a-radio
          v-for="item in commChannels"
          :value="item.key"
          :key="item.key"
          >{{ item.value }}</a-radio
        >
      </a-radio-group>
    </div>
    <div :style="{ display: 'flex', marginBottom: '1rem' }">
      <a-tag
        :style="{ width: '6rem', minWidth: '6rem', height: '1.5rem' }"
        color="success"
      >
        <template #icon>
          <sync-outlined :spin="true" />
        </template>
        发送内容
      </a-tag>
      <a-input-search
        v-model:value="sendContext"
        placeholder="请填写内容"
        enter-button="发送"
        size="large"
        @search="hdlSend"
      />
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
  name: "singleSendReceipt",
  // 导入组件
  components: {},
  setup() {
    // 定义变量
    let socket = null;
    let stompClient = null; // 发送方客户端
    const sendContext = ref(); // 发送内容
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
    const selectedSendChannel = ref(""); // 选中发送频道
    const selectedReceiptChannel = ref(""); // 选中接收频道
    const lastSendChannel = ref(""); // 上一次发送频道
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
      // stompClient.debug = null;
    };
    // 销毁Stomp协议客户端
    const disConn = (client) => {
      if (null != client) {
        client.disconnect();
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
    const hdlSendChange = () => {
      console.log("发送频道选择事件", stompClient.subscriptions);
      if ("" !== lastSendChannel.value) {
        unSubSingle(lastSendChannel.value);
      }
      lastSendChannel.value = selectedSendChannel.value;
      subSingle(selectedSendChannel.value);
    };
    const hdlReceiptChange = () => {
      console.log("接收频道选择事件");
      if ("" !== lastReceiptChannel.value) {
        unSubSingle(lastReceiptChannel.value);
      }
      lastReceiptChannel.value = selectedReceiptChannel.value;
      subSingle(selectedReceiptChannel.value);
    };
    // 处理发送事件
    const hdlSend = () => {
      let sendData = {
        // name: selectedSendChannel.value,
        // chatValue: sendContext.value,
        // userId: selectedReceiptChannel.value,
        sendId: selectedSendChannel.value,
        sendName: selectedSendChannel.value,
        receiptId: selectedReceiptChannel.value,
        receiptName: selectedReceiptChannel.value,
        sendMsg: sendContext.value,
      };
      for (let item of commChannels.value) {
        if (sendData.sendId === item.key) {
          sendData.sendName = item.value;
        }
        if (sendData.receiptId === item.key) {
          sendData.receiptName = item.value;
        }
      }
      stompClient.send("/client-send-single", {}, JSON.stringify(sendData));
    };
    // 订阅单人通信
    const subSingle = (channel) => {
      if (null !== channel && "" !== channel) {
        return stompClient.subscribe(
          "/server-send-single/" + channel + "/",
          (result) => {
            console.log("订阅结果：", result);
            message.success("收到一条消息，请查看", 1);
            if (result.body !== null) {
              let pushData = JSON.parse(result.body);
              tableData.value.push(pushData.data);
              console.log(pushData);
            }
          },
          { id: channel }
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
      selectedSendChannel,
      hdlSendChange,
      selectedReceiptChannel,
      hdlReceiptChange,
      tableColumns,
      tableData,
      sendContext,
      hdlSend,
    };
  },
});
</script>
