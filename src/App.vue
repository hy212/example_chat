<template>
  <div>
    <div class="chatRoom" v-if="loginUser">
      <div class="title">聊天室</div>
      <div class="chartContent" ref="chartContent">
        <div class="item"
             :class="item.type"
             v-for="(item, index) in chatList" :key="index">
          <div class="avatar">{{ item.type === 'other' ? '其他' : '我'}}</div>
          <div>
            <div class="nickName" v-if="item.type === 'other'">{{ item.username }}</div>
            <div class="msg">{{ item.msg }}</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <textarea v-model="text" class="input" @keydown="handleKeyCode($event)" ref="input" />
        <button class="sendBtn" @click="sendData">发送</button>
      </div>
    </div>
    <!--  填写用户名  -->
    <div class="userLogin" v-else>
      <div class="title">请设置群聊昵称</div>
      <div class="userInputBox">
        <img src="@/images/icon-user.png" />
        <input v-model="nickName" placeholder="昵称" @keyup.enter="setLoginName"/>
      </div>
      <button class="enterBtn" @click="setLoginName" :class="{ disabled : !nickName || !nickName.trim() }">进入聊天室</button>
    </div>
    <!--  /填写用户名  -->
  </div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      responseData: '',
      text: '',
      chatList: [
        // {
        //   type: 'other',
        //   username: `用户${parseInt(Math.random() * 1000)}`,
        //   msg: '您好，请问有什么能帮您的吗？',
        //   time: new Date().getTime()
        // },
        // {
        //   type: 'self',
        //   username: 'xyinghu',
        //   msg: '您好，请问有什么能帮您的吗？',
        //   time: new Date().getTime()
        // }
      ],
      loginUser: '', // 登录用户
      nickName: `用户${parseInt(Math.random() * 1000)}`
    }
  },
  created() {
    const userName =  window.localStorage.getItem('nickName');
    this.loginUser = userName || '';
    if (this.loginUser) {
      this.getMsgTimer();
    }
  },
  methods: {
    getMsgTimer() {
      setInterval(()=> {
        this.getMsgList();
      }, 2000);
    },
    /** 设置登录用户名 */
    setLoginName() {
      if (this.nickName && this.nickName.trim()) {
        this.loginUser = this.nickName.trim();
        window.localStorage.setItem('nickName', this.loginUser);
        this.getMsgTimer();
      }
    },
    sendData() {
      if (!this.text.trim()) {
        return;
      }
      const queryArgs =  {
        msg: this.text,
        username: this.loginUser,
        time: new Date().getTime(),
      }
      this.chatList.push({
       ...queryArgs,
        type: 'self',
      });
      this.text = '';
      this.scrollToBottom();
      axios.post('/functions/postmsg', queryArgs).then((response)=> {
        console.log('请求成功', response);
        this.scrollToBottom();
      }).catch(function (error) {
        console.log('请求失败', error);
      });
    },
    /** 获取消息列表 */
    getMsgList() {
      axios.get('/functions/getmsg').then((response)=> {
        const resData = response.data.data;
        resData.forEach(v=>{
          v.type = v.username === this.loginUser ? 'self' : 'other';
        })
        this.chatList = resData;
        console.log('请求成功', response);
        this.scrollToBottom();
      }).catch(function (error) {
        console.log('请求失败', error);
      });
    },
    scrollToBottom() {
      this.$nextTick(()=> {
        this.$refs.chartContent.scrollTop =  this.$refs.chartContent.scrollHeight;
      })
    },
    /** 键盘回车事件: 回车发送，ctrl+enter实现换行 */
    handleKeyCode(event) {
      if (event.keyCode === 13) { // 仅回车， 发送消息
        if (!event.ctrlKey) {
          event.preventDefault();
          this.sendData();
        } else { // 换行
          console.log('换行');
          this.text = this.text + '\n';
          this.$nextTick(()=> {
            this.$refs.input.scrollTop =  this.$refs.input.scrollHeight;
          })
        }
      }
    },
  }
}
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background: #dddddd;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #d4d4d4;
  }
  ::-webkit-scrollbar-track {
    background: #f8f8f8;
  }
  ::-webkit-scrollbar-track:hover {
    background: #f5f5f5;
  }
  .chatRoom{
    width: 800px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    margin: 10% auto 0;
  }
  .chatRoom .title{
    padding: 15px;
    border-bottom: 1px solid #d7d7d7;
  }
  .chatRoom .chartContent{
    padding: 10px;
    background: #f8f8f8;
    height: 60vh;
    overflow: auto;
  }
  .chartContent .item{
    display: flex;
    padding: 10px;
    font-size: 14px;
    flex: 1;
  }
  .chartContent .item .avatar{
    width: 40px;
    height: 40px;
    border: 1px solid #d7d7d7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: #f5f8fa;
    flex-shrink: 0;
  }
  .chartContent .item .msg{
    padding: 10px;
    border-radius: 4px;
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.1));
    word-break: break-all;
    position: relative;
    white-space: pre-wrap;
  }
  .chartContent .item.other .msg{
    margin-left: 15px;
    background: #ffffff;
  }
  .chartContent .item.other .msg:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -15px;
    margin-top: -15px;
    border: 8px solid transparent;
    border-right: 8px solid #ffffff;
  }
  .chartContent .item.self{
   flex-direction: row-reverse;
  }
  .chartContent .item.self .msg{
    margin-right: 10px;
    background: #4ed24e;
  }
  .chartContent .item.self .msg:before {
    content: "";
    position: absolute;
    top: 50%;
    right: -15px;
    margin-top: -15px;
    border: 8px solid transparent;
    border-left: 8px solid #4ed24e;
  }
  .footer{
    display: flex;
    font-size: 0;
    align-items: center;
  }
  .footer, .footer .input{
    height: 40px;
  }
  .footer .input{
    width: 90%;
    font-size: 14px;
    padding: 10px;
    border: none;
    outline: none;
    white-space: pre-wrap;
    resize: none;
  }
  .sendBtn{
    background: rgba(1, 82, 218, 0.83);
    border: none;
    width: 9%;
    height: 80%;
    color: #ffffff;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  .sendBtn:hover{
    background: rgba(1, 82, 218, 0.5);
  }
  .footer .input::-webkit-scrollbar {
    display: none;
  }
  /** 用户昵称 */
  body{
    background: #f8f8f8;
  }
  .userLogin{
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 50%;*/
    /*transform: translate(-50%, -50%);*/
    margin: 10% auto 0;
    width: 400px;
    height: 200px;
    /*border: 1px solid #d7d7d7;*/
    background: #ffffff;
    box-shadow: 0 0 4px rgba(0.5, 0.5, 0.5, 0.1);
    text-align: center;
    border-radius: 8px;
  }
  .userLogin .title{
    font-size: 16px;
    padding: 20px 0;
    font-weight: bold;
  }
  .userLogin input{
    font-size: 16px;
    width: 80%;
    height: 50px;
    line-height: 24px;
    padding: 10px 5px 10px 40px;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #d7d7d7;
    outline: none;
  }
  .userInputBox{
    position: relative;
  }
  .userInputBox img{
    max-width: 24px;
    position: absolute;
    top: 10px;
  }
  .userLogin .enterBtn{
    margin-top: 30px;
    background: #5465cf;
    color: #ffffff;
    font-size: 14px;
    padding: 0 15px;
    line-height: 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .userLogin .enterBtn:hover{
    opacity: 0.8;
  }
  .userLogin .enterBtn.disabled{
    cursor: not-allowed;
    background: #ccc;
  }
  .nickName{
    font-size: 12px;
    color: #999;
    padding-left: 15px;
    margin-bottom: 2px;
  }
</style>
