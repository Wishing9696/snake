// pages/snake/snake.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    history: 0,
    start_x: 0,
    start_y: 0,
    end_x: 0,
    end_y: 0,
    rows: 28,
    cols: 22,


    ground: [],
    snake: [],
    food: [0, 0],

    direction: "right",
    timer: ""
  },

  /**
   * 
   *手指触摸监听
   *tapstart手指按下
   */
  tapstart: function (e) {
    this.setData({
      start_x: e.touches[0].pageX,
      start_y: e.touches[0].pageY
    })
  },
  /**
   * 
   *手指触摸监听
   *tapmove手指移动
   */
  tapmove: function (e) {
    this.setData({
      end_x: e.touches[0].pageX,
      end_y: e.touches[0].pageY
    })
  },

  //改变方向
  changeDirection: function (dir) {
    var snake = this.data.snake;
    var len = snake.length;
    var snakeHEAD = snake[len - 1];
    var snakeTAIL = snake[0];
    var ground = this.data.ground;
    // 碰撞到食物
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0;
    // 更新身体
    for (var i = 0; i < len - 1; i++)
      snake[i] = snake[i + 1]

    // 更新蛇头坐标
    var x = snake[len - 1][0]
    var y = snake[len - 1][1]
console.log(dir)
    switch (dir) {
      case "left":
        y = y - 1;
        break
      case "right":
        y = y + 1
        break
      case "up":
        x = x - 1
        break
      case "down":
        x = x + 1
        break
    }

    snake[len - 1] = [x, y]

    // 将蛇尾添加到蛇身体中
    this.check_Game(snakeTAIL)

    
    // 地图上蛇身所在区域重新绘制
    for (var i = 0; i < len; i++)
    {
      ground[snake[i][0]][snake[i][1]] = 1
    }

    this.setData({
      ground: ground,
      snake: snake
    })
    return true;
  },
  /**
   * 
   *手指触摸监听
   *tapend手指松开
   */
  tapend: function (e) {
    // 获取滑动距离，当手指划出屏幕不再赋值
    var distance_x = (this.data.end_x > 0) ? this.data.end_x - this.data.start_x : 0
    var distance_y = (this.data.end_y > 0) ? this.data.end_y - this.data.start_y : 0
    // console.log(distance_x + " " + distance_y)
    // // 判断滑动方向
    // if (Math.abs(distance_x) > Math.abs(distance_y) && distance_x > 0) {
    //   console.log("向右滑动")
    // } else if (Math.abs(distance_x) > Math.abs(distance_y) && distance_x < 0) {
    //   console.log("向左滑动")
    // } else if (Math.abs(distance_x) < Math.abs(distance_y) && distance_y < 0) {
    //   console.log("向上滑动")
    // } else if (Math.abs(distance_x) < Math.abs(distance_y) && distance_y > 0) {
    //   console.log("向下滑动")
    // } else {
    //   console.log("点击但未滑动")
    // }
    // console.log("触摸结束")

    // 使用面向对象方法进行滑动判断
    if (Math.abs(distance_x) > 5 || Math.abs(distance_y) > 5) {
      var direction
      if (Math.abs(distance_x) > Math.abs(distance_y)) {
        direction = this.judge(1, distance_x)
      } else {
        direction = this.judge(0, distance_y)
      }
      switch (direction) {
        case "left":
          if (this.data.direction == "right")
            return;
          break;
        case "right":
          if (this.data.direction == "left")
            return;
          break;
        case "down":
          if (this.data.direction == "up")
            return;
          break;
        case "up":
          if (this.data.direction == "down")
            return;
          break;
      }
      console.log(direction)
      this.setData({
        direction: direction,
        start_x: 0,
        start_y: 0,
        end_x: 0,
        end_y: 0
      })
    }
  },

  // 判断方向的函数，这里参数一个是布尔值，1表示水平方向，0表示垂直方向，distance是传回的距离值
  judge: function (judge, distance) {
    // 左右滑动
    if (judge)
      return distance > 0 ? "right" : "left"
    // 上下滑动
    else
      return distance > 0 ? "down" : "up"
  },
  /**
   * 
   * 初始化蛇 
   */
  initSnake: function (len) {
    let gro = this.data.ground
    let sna = this.data.snake
    for (var i = 0; i < len; i++) {
      gro[0][i] = 1
      sna.push([0, i])
    }
    this.setData({
      ground: gro,
      snake: sna
    })
  },

  /**
   * 
   * 初始化食物
   */
  initFood: function () {
    //生成随机坐标
    var x = Math.floor(Math.random() * this.data.rows)
    var y = Math.floor(Math.random() * this.data.cols)
    var ground = this.data.ground
    var snake = this.data.snake
    ground[x][y] = 2

    for (var i = 0; i < snake.length; i++) {
      var node = snake[i][1]

      if (x == 0 && y == node) {
        this.initFood()
        return
      } else {
        this.setData({
          ground: ground,
          food: [x, y]
        })
      }
    }
  },
  initGame: function () {
    if (this.data.timer != "") {
      clearInterval(this.data.timer)
    } else {
      this.initSnake(1)
      this.initFood()
      this.move()
    }
  },

  // 初始化操场
  initGround: function (rows, cols) {
    for (var i = 0; i < rows; i++) {
      // 将ground变成二维数组
      var array = []
      this.data.ground.push(array)

      for (var j = 0; j < cols; j++) {
        this.data.ground[i].push(0)
      }
    }
  },

  // 移动函数
  move: function () {
    var that = this
    this.data.timer = setInterval(function () {
      that.changeDirection(that.data.direction)
      that.setData({
        ground: that.data.ground
      })
    }, 500)
    console.log("timer" + this.data.timer)
  },

  // 游戏状态
  check_Game: function (snakeTAIL) {
    // 获取小蛇数据
    var arr = this.data.snake
    var len = this.data.snake.length
    var snake_head = arr[len - 1];

    // 小蛇超过了操场边框
    if (snake_head[0] < 0 || snake_head[0] > this.data.rows - 2 ||
      snake_head[1] < 0 || snake_head[1] > this.data.cols - 2) {
      clearInterval(this.data.timer)
      this.setData({
        modal_hidden: false
      })
    }
    // 小蛇碰到了自己
    for (var i = 0; i < len - 1; i++) {
      if (snake_head[0] == arr[i][0] && snake_head[1] == arr[i][1]) {
        clearInterval(this.data.timer)
        this.setData({
          modal_hidden: false
        })
      }
    }
    // 小蛇碰撞到食物
    if (snake_head[0] == this.data.food[0] && snake_head[1] == this.data.food[1]) {
      // snakeTAIL专门用来添加蛇的长度
      arr.unshift(snakeTAIL)
      this.setData({
        score: this.data.score + 10
      })
      // 再创建一个食物
      this.initFood()

      // 这里应该再添加统计历史最高分的函数
      this.storeScore()
    }
  },

  // 统计历史最最高分
  storeScore: function () {
    var maxscore_cur = this.data.maxscore > this.data.score ? this.data.maxscore : this.data.score

    this.setData({
      maxscore: maxscore_cur
    })

    wx.setStorageSync('maxscore', maxscore_cur)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initGround(this.data.rows, this.data.cols)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})