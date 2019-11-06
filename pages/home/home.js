// pages/home/home.js
import {
  getMultiData,
  getGoodsData
} from '../../service/home.js'
const TOP_DISTANCE = 1000;
const types = ['pop', 'new', 'sell'];

Page({
  data: {
    banners: [],
    recommends: [],
    titles: ['流行', '新款', '精选'],
    goods: {
      pop: {
        page: 0,
        list: []
      },
      new: {
        page: 0,
        list: []
      },
      sell: {
        page: 0,
        list: []
      }
    },
    currentType: 'pop',
    isTabFixed: false,
    showBackTop: false,
    tabScrollTop: 0
  },

  onLoad: function(options) {
    //1请求轮播图以及推荐数据
    this._getMultidata();
    //2请求商品的数据
    this._getGoodsData(this.data.currentType);
  },
  //------------请求轮播图以及推荐数据的方法-------------
  _getMultidata() {
    getMultiData().then(res => {
      //取出轮播图和推荐的数据 放到局部变量中
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;
      //console.log(banners);
      //将局部变量中数据更新到page的data对象中
      this.setData({
        banners,
        recommends
      })
    })
  },
  //------------请求商品的数据的方法
  _getGoodsData(type) {
    //1获取页面
    const page = this.data.goods[type].page + 1;
    //2发送网络请求
    getGoodsData(type, page).then(res => {
      //2.1.取出数据
      const list = res.data.data.list;
      //2.2将数据设置到对应type的list中
      const oldList = this.data.goods[type].list;
      oldList.push(...list);
      //2.3将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`;
      const pageKey = `goods.${type}.page`;
      this.setData({
        [typekey]: oldList,
        [pageKey]: page
      })
    });
  },
  //-------------通过组件事件激发,父页绑定事件所对应的方法---------------
  handleTabClick(event) {
    //取出index
    const index = event.detail.index;
    //设置currentType
    this.setData({
      currentType: types[index]
    })
  },
  handleImageLoad() {
    //console.log("图片加载完成");
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      console.log(rect);
      this.data.tabScrollTop = rect.top;
    }).exec()
  },

  onReachBottom() {
    //上拉加载跟多
    this._getGoodsData(this.data.currentType);
  },






  onPageScroll(options) {
    //取出scrollTop
    const scrollTop = options.scrollTop;
    //修改showBackTop属性
    //不要再滚动的函数回调中频繁的调用this.setData
    const flag1 = scrollTop >= TOP_DISTANCE;
    if (flag1 != this.data.showBackTop) {
      this.setData({
        showBackTop: flag1
      })
    }


    //修改isTabFixed属性
    const flag2 = scrollTop >= this.data.tabScrollTop;
    if (flag2 != this.data.isTabFixed) {
      this.setData({
        isTabFixed: flag2
      })
    }
  }

})