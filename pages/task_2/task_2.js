// let zhuangtai0 = ''
const db = wx.cloud.database()

Page({

  data: {
    list: [],
    zhuangtai0: '',

  },
  onLoad() {

    //wx.startPullDownRefresh() 进入页面展示刷新动画（废除

    this.getRefresh()

    //云函数查询云数据库
    // wx.cloud.callFunction({
    //   name: 'getData'
    // })
    // .then(res =>{
    //   console.log('云函数获取数据成功',res)
    //   this.setData({
    //     list: res.data
    //   })
    //   // zhuangtai0: res.data.ZhuangTai
    // })
    // .catch(res => {
    //   console.log('云函数获取数据失败',res)
    // })

  },


  getRefresh() {
    //请求数据图标

    wx.showLoading({
      icon:'loading',
      title: '请求数据中...',

    })



    //获取list长度以便于分页加载
    let len = this.data.list.length
    console.log('当前list长度', len)

    //本地小程序查询云数据库es6标准写法
    wx.cloud.database().collection('task')
      .orderBy('FinishTime','desc')
      .where({
        ZhuangTai: 2,
      })
      .skip(len) //page
      .get()
      .then(res => {
        wx.hideLoading() //隐藏请求数据图标
        console.log('请求数据成功', res.data)
        let dataList = res.data
        if (dataList <= 1) {
          wx.showToast({
            icon: 'none',
            title: '没有更多数据了！',
          })
        }

        this.setData({
          list: this.data.list.concat(res.data),
          // zhuangtai0: res.data.ZhuangTai
        })
        wx.stopPullDownRefresh() //停止刷新动画

      })
      .catch(err => {
        console.log('请求数据失败了', err)
        wx.hideLoading() //隐藏请求数据图标
        wx.showToast({
          icon: 'error',
          title: '请求失败',
        })
      })
  },


  //跳转到task_detail详情页
  GoToDetail(e) {
    console.log('点击了跳转详情页', e.currentTarget.dataset.id)
    //跳转到报修单详情页，并携带商品值
    wx.navigateTo({
      url: '../task_detail/task_detail?id=' + e.currentTarget.dataset.id
    })
  },
    //跳转到 待完成 界面
    GoTotask1(e){
      wx.navigateTo({
        url: '../task_3/task_3',
      })
    },
  
    //跳转到 未处理 界面
    GoTotask0(e){
      wx.navigateTo({
        url: '../task/task',
      })
    },

  //触底刷新20条
  onReachBottom() {
    console.log('触底刷新')

    this.getRefresh()
  },

  //上拉刷新
  onPullDownRefresh() {
    console.log('task界面刷新数据')
    this.getRefresh()
    wx.showToast({
      icon: 'success',
      title: '刷新成功',
    })

  },

  onUnload() {
    // 只能跳转到tabBar配置页面
    console.log('回到我的界面')
    wx.switchTab({
      url: '/pages/mine/mine',
    });

  },
})