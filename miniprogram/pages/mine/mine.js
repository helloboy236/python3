//index.js
//获取应用实例
const app = getApp()
var mydate = new Date()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('users')
Page({
  data: {
    screen_width: 0,
    screen_height: 0,
    xcxm_hidden: true,
    hasUserInfo: false,
    give_name_hidden: true,
    notes_hidden: true,
    mark_show_share: 0,
    mark_show_notes: 0,
    mark_show_name: 0,
    xcxm_w: 0,
    xcxm_h: 0,
    userInfor: {},
    bodyguard1_name: '保镖',
    bodyguard2_name: '侍卫',
    appellation: '主上',
    guard1_picture: 'xcx_python.png',
    guard2_picture: 'xcx_python.png',
    user_picture: '',
    notes_html: '<table width="335m"><tr><th>更新历史</th></tr>' +
      '<tr><td width="80rpx">日期</td><td width="55rpx">版本号</td><td>更新内容</td></tr>' +
      '<tr><td>2019/3/10</td><td>1.3.2</td><td>1、增加基础实战部分<br/>2、优化代码，提升体验</td></tr>' +
      '<tr><td>2019/3/9</td><td>1.3.1</td><td>1、增加部分娱乐功能，劳逸结合<br/>2、增加更换头像及昵称功能<br/>3、优化小程序（包括按键、弹幕系统等）</td></tr>' +
      '<tr><td>2019/3/7</td><td>1.3.0</td><td>增加视频学习功能</td></tr></table>'
  },
  onLoad: function(options) {
    wx.showLoading({
      title: 'loading',
      mask: true
    })

    wx.setTopBarText({
      text: 'hello, world!'
    })
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        app.globalData.userInfo = res.userInfo
        that.setData({
          user_picture: app.globalData.userInfo.avatarUrl,
          appellation: app.globalData.userInfo.nickName
        })
        todos.where({
          nickName: app.globalData.userInfo.nickName
        }).get({
          success(res) {
            that.setData({
              bodyguard1_name: res.data[0]['bodyguard1_name'],
              bodyguard2_name: res.data[0]['bodyguard2_name'],
              appellation: res.data[0]['appellation'],
              guard1_picture: res.data[0]['guard1_picture'],
              guard2_picture: res.data[0]['guard2_picture'],
              user_picture: res.data[0]['user_picture'],
            })
            if (res.data.length != 0) {
              var id = res.data[0]['_id']
              todos.doc(id).update({
                data: {
                  lastTime: mydate.toLocaleTimeString(),
                  times: db.command.inc(1)
                }
              })
            }
          },
        })
        wx.hideLoading()
        wx.showToast({
          title: '欢迎回来,' + that.data.appellation
        })
        that.setData({
          xcxm_hidden: false,
          userInfor: res.userInfo,
          hasUserInfo: true,
          hidden: false
        })
      }
    })
  },
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: 'mine',
    })
  },
  onShareAppMessage: function() {
    wx.showShareMenu({

    })
  },
  upload_data:function(name,picture_url){
    var that=this
    todos.where({
      nickName: app.globalData.fuserInfo.nickName
    }).get({
      success(res) {
        if (res.data.length != 0) {
            var id = res.data[0]['_id']
            todos.doc(id).update({
              data: {
                [name]:picture_url
              }
            })
        }
      },
    })
  },
  upload_picture: function(name) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: 'user_image/' + app.globalData.userInfo.nickName + '/' + name + '_' + Math.floor(Math.random() * 100000) + '.jpg',
          filePath: tempFilePaths[0],
          success(res) {
            that.upload_data(name,res.fileID)
            that.setData({
              [name]: res.fileID
            })
          },
          fail(res) {
          }
        })
      }
    })
  },
  test: function() {
    var that = this
    var cs = console.log
    wx.showModal({
      title: '提示',
      content: '三个头像及昵称都可以修改，去试试吧',
      showCancel:false,
      confirmText:'我知道了'
    })
  },
  share_facetoface: function() {
    var that = this
    if (this.data.mark_show_share == 0) {
      wx.showToast({
        title: '点击图片关闭',
        icon: 'none'
      })
      this.setData({
        xcxm_h: 600,
        xcxm_w: 600,
        mark_show_share: 1
      })
    } else {
      wx.showToast({
        title: '感谢分享',
        icon: 'none'
      })
      this.setData({
        xcxm_h: 0,
        xcxm_w: 0,
        mark_show_share: 0
      })
    }
  },
  guard1_picture_request: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: this.data.appellation + '换个头像?',
      cancelText: '不需要',
      confirmText: '去选一张',
      success: function(res) {
        if (res.confirm)
          that.upload_picture('guard1_picture')
      }
    })
  },
  guard2_picture_request: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: this.data.appellation + ',换个头像玩?',
      cancelText: '不换',
      confirmText: '去选一张',
      success: function(res) {
        if (res.confirm)
          that.upload_picture('guard2_picture')
      }
    })
  },
  user_picture_request: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: this.data.appellation + ',换个头像玩玩？？？',
      cancelText: '不想换',
      confirmText: '去选一张',
      success: function(res) {
        if (res.confirm)
          that.upload_picture('user_picture')
      }
    })
  },
  bodyguard: function() {
    if (this.data.mark_show_name == 0)
      this.setData({
        mark_show_name: 1,
        give_name_hidden: false,
      })
    else {
      this.setData({
        mark_show_name: 0,
        give_name_hidden: true
      })
    }
  },
  give_name: function(e) {
    var that = this
    that.setData({
      bodyguard1_name: e.detail.value.bodyguard_name1,
      bodyguard2_name: e.detail.value.bodyguard_name2,
      appellation: e.detail.value.appellation,
      give_name_hidden: true
    })
    todos.where({
      nickName: app.globalData.userInfo.nickName
    }).get({
      success(res) {
        if (res.data.length != 0 && res.data[0]['appellation'] != undefined) {
          if (that.data.appellation == '') {
            that.setData({
              appellation: app.globalData.userInfo.nickName,
            })
            var id = res.data[0]['_id']
            todos.doc(id).update({
              data: {
                bodyguard1_name: that.data.bodyguard1_name,
                bodyguard2_name: that.data.bodyguard2_name,
                appellation: that.data.appellation
              }
            })
          } else {
            var id = res.data[0]['_id']
            todos.doc(id).update({
              data: {
                bodyguard1_name: that.data.bodyguard1_name,
                bodyguard2_name: that.data.bodyguard2_name,
                appellation: that.data.appellation
              }
            })
          }
        } else {
          todos.add({
            data: {
              nickName: app.globalData.userInfo.nickName,
              bodyguard1_name: that.data.bodyguard1_name,
              bodyguard2_name: that.data.bodyguard2_name,
              appellation: that.data.appellation,
              lastTime: mydate.toLocaleTimeString(),
              times: 1,
              guard1_picture: 'xcx_python.png',
              guard2_picture: 'xcx_python.png',
              user_picture: app.globalData.userInfo.avatarUrl,
            }
          })
        }
      },
    })
    wx.showToast({
      title: '修改成功',
    })
  },
  notes: function() {
    if (this.data.mark_show_notes == 0)
    {
     wx.showToast({
       title: '点击可返回',
       icon:'none'
     })
      this.setData({
        mark_show_notes: 1,
        notes_hidden: false
      })
    }
    else {
      this.setData({
        mark_show_notes: 0,
        notes_hidden: true
      })
    }
  },
  about: function() {
    wx.navigateTo({
      url: 'about/about'
    })
  },
  translation:function(){
    wx.navigateTo({
      url: 'translation/translation',
    })
  }
})