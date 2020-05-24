Page({
    data: {
        length: 10,
        energyList: [],  //能量球
        disablePosShow: {},  //按钮信息
        integralPos: {}, //最多出现的位置
        isClick: 0, //记录领取了几次
        sum: 0,
        addTimer: '',
        arred: [], //能量球的index
    },
    onLoad() {
        this.energyInit()
    },

    //初始化能量球
    energyInit() {
        let t = this,
            arr = [];
        t.integralPos(() => {
            for (var j = 0; j < t.data.length; j++) {
                let obj = t.isCreate(arr)
                if (obj) {
                    arr.push(obj)
                } else {
                    j--
                }
            }
            this.setData({
                energyList: arr
            })
        })
    },

    //获取收取按钮的位置
    integralPos(callback) {
        let t = this
        wx.getSystemInfo({
            success(res) {
                wx.createSelectorQuery().select('.get_integral').boundingClientRect(function (rect) {
                    t.data.disablePosShow = rect
                    console.log(rect);
                    t.data.integralPos.maxWidth = res.windowWidth - 50
                    t.data.integralPos.maxHeight = rect.bottom
                    callback()
                }).exec();
            }
        })

    },

    //圆和圆之间不可以重叠 判断两个元之间的圆心距离
    getCircleDistance(p1, p2, distanceToBall) {
        let dx = Math.abs(p2.left - p1.left),
            dy = Math.abs(p2.top - p1.top),
            //两个圆之间的距离
            disToBall = parseInt(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
        return disToBall > distanceToBall;
    },

    //58为每个能量球的宽度
    disablePos(left, top) {
        if (left > this.data.disablePosShow.left - 55 && left < this.data.disablePosShow.left + this.data.disablePosShow.width && top > this.data.disablePosShow.top - 55) {
            return false
        } else {
            return true
        }
    },


    trainFn(min, max) {
        let num = Math.floor(Math.random() * (max - min + 1) + min)
        return num
    },

    isCreate(overList) {
        let t = this,
            obj = {
                left: t.trainFn(0, t.data.integralPos.maxWidth),
                top: t.trainFn(0, t.data.integralPos.maxHeight - 25),
                // size: t.trainFn(70),
                size: 80,
                anm_time: (Math.random()).toFixed(1),
                num: t.trainFn(2, 20),
                title: `签到`,
                styleObject: '',
                childStyle: '',
                isShow: true,
            }
        // obj.top = t.trainFn(10, t.data.integralPos.maxHeight-obj.size)
        obj.styleObject = `left: ${obj.left}px; top: ${obj.top}px; animation: heart 1.3s ease-in-out ${obj.anm_time}s infinite alternate`
        obj.childStyle = `width: ${obj.size}rpx; height: ${obj.size}rpx; line-height: ${obj.size}rpx`
        if (obj.size < 50) {
            obj.childStyle = `width: ${obj.size}rpx; height: ${obj.size}rpx; line-height: ${obj.size}rpx; font-size: 22rpx;`
        }
        let isflag = true
        if (!t.disablePos(obj.left, obj.top)) {
            isflag = false
        }
        overList.forEach((item) => {
            if (!t.getCircleDistance(item, obj, 60)) {
                isflag = false
            }
        })
        if (isflag) {
            return obj
        }
    },

    //收取动画
    gatherAn(item, style) {
        this.setData({
            [style]: item.styleObject
        })
        let addTotal = this.data.sum + Number(item.num)
        this.data.addTimer = setInterval(() => {
            if (this.data.sum != addTotal) {
                this.setData({
                    sum: this.data.sum + 1
                })
            } else {
                clearInterval(this.data.addTimer)
            }
        }, 10)
    },

    //点击能量球领取积分
    pullEnergy(e) {
        this.data.isClick++
        clearInterval(this.data.addTimer)
        let index = e.currentTarget.dataset.i,
            item = this.data.energyList[index],
            style = `energyList[${index}].styleObject`;
        // 158 是按钮的top加上高度的一半再减能量去的宽
        // 154 是按钮的left加上宽度的一半再减能量去的宽
        item.styleObject = item.styleObject.replace(item.top, 152)
        item.styleObject = item.styleObject.replace(item.left, 154)
        if(this.data.isClick>10) {
            this.setData({
                energyList: []
            })
            return
        }
        this.gatherAn(item, style)
    },

    arredFn() {
        let index = this.trainFn(0, this.data.energyList.length - 1);
        if (this.data.arred.indexOf(index) == -1) {
            this.data.arred.push(index)
            this.data.isClick++
            return index
        } else {
            return this.arredFn()
        }
    },
    //点击按钮收取能量 
    pullAllEnergy() {
        if (this.data.isClick >= 10) return
        clearInterval(this.data.addTimer)
        let index = this.arredFn(),
            item = this.data.energyList[index],
            style = `energyList[${index}].styleObject`;
        item.styleObject = item.styleObject.replace(item.top, 152)
        item.styleObject = item.styleObject.replace(item.left, 154)
        this.gatherAn(item, style)
    }

})