var time1 = $('.time1');
var time2 = $('.time2');
var time3 = $('.time3');
var weekdayTitle = $('.week');
var date = $('.date');
var up = $('.up');
var down = $('.down');
var reset = $('.reset');
var animate = $('#animate');
var wrap = $('#wrap');
var tips = $('.tips');

//启动动画
animate.animate({
	left: '30%'
}, 1000).animate({
	top: 140,
	height: 10
}, 200).animate({
	width: 422
}, 300, function () {
	wrap.fadeIn();
	// tips.slideDown(2000);
	animate.siblings('.tips').delay(200).fadeIn()
});

//主时间time1
moment.locale('zh-cn');

function randerTime1() {
	time1.html(moment().format('LTS'))
}
// setInterval(getNowTime,1000);

//小时间time2
function randerTime2() {
	time2.html(moment().format('LL'))
	// $('.tips .tips1 span:first')
}

//tips时间
function randerTime3() {
	$('.tips .tips1 .tips-data').html(moment().format('YYYY-MM-DD'))
	// $('.tips .tips1 .tips-calendar').html()农历渲染放在了日历页面渲染函数中
}

//星期标题
// console.log(weekday)
function wTitle() {
	var weekday = moment.weekdaysMin(true);
	var str = '';
	weekday.forEach(function (item) {
		str += '<span>' + item + '</span>';
	})
	weekdayTitle.html(str);
}

//日期日历


//获取某月第一天的星期--第一天.weekday
//！该操作将更改日期，请注意备份！
function getFirstWeekday(m) {
	return m.startOf('month').weekday();
}
// console.log(getFirstWeekday(moment()))//OK

//获取此月的天数
//！更改月份操作将更改日期，请注意备份！
function getMonthDays(m) {
	return m.daysInMonth();
}
// console.log(getMonthDays(moment()));//OK

//渲染日期日历
//本月第一天的星期+本月的天数 --- 在中间
//本月第一天的索引值为上个月剩余的天数 --- 在前边
//本月天数的值等于下个月起始的索引值 --- 在后边
//上个月的总天数等于上个月的最后一天的数字 --- 在前面
/**
 * 渲染日期日历函数，传入一个moment对象
 * @param {*} m moment()
 */
function randomDate(m) {
	var str = '';
	var week = getFirstWeekday(m.clone());
	// console.log(week)
	var lastMonth = getMonthDays(m.clone().subtract(1, 'month'))
	var nowMonth = getMonthDays(m);
	var nextMonthStart = 0;
	for (var i = 0; i < 42; i++) {
		if (i < week) { //本月第一天的索引值为上个月剩余的天数,week的值-1与该值相等
			str = `<li class="color"><span>${lastMonth}</span><span>${getLunar(m.year(), m.month(), lastMonth)}</span></li>` + str
			lastMonth--;
		} else if (i < week + nowMonth) { //本月
			var at = m.date() == i - week + 1 ? 'now' : '';
			if (m.year() != moment().year() || m.month() != moment().month()) {
				at = '';
				reset.css('display', 'block')
			} else {
				reset.css('display', 'none')
			}
			var nowTime = getLunar(m.year(), m.month() + 1, i - week + 1);
			str += `<li class="${at}"><span >${i - week + 1}</span><span>${nowTime}</span></li>`;
		} else { //下个月
			nextMonthStart++;
			str += `<li class="color"><span>${nextMonthStart}</span><span>${getLunar(m.year(), m.month() + 2, nextMonthStart)}</span></li>`;

		}
	}
	time3.html(today.format('YYYY年MMM'));

	date.html(str);
	// console.log(str);
}
var today = moment();
randomDate(today);


// console.log(window.calendar.lunar2solar(2020,08,24))
/***
 * Animal: "鼠"
IDayCn: "廿四"
IMonthCn: "八月"
Term: null
astro: "天秤座"
cDay: 10
cMonth: 10
cYear: 2020
date: "2020-10-10"
festival: null
gzDay: "丙戌"
gzMonth: "丙戌"
gzYear: "庚子"
isLeap: false
isTerm: false
isToday: false
lDay: 24
lMonth: 8
lYear: 2020
lunarDate: "2020-8-24"
lunarFestival: null
nWeek: 6
ncWeek: "星期六"
 */


/**
 * 获取农历
 * */
function getLunar(year, month, day) {
	var result = '';
	var ready = window.calendar.solar2lunar(year, month, day);
	//window.calendar.solar2lunar 是一个存在于由引入的calendar组件产生的位于全局的方法
	//方法返回一个对象，包含许多 键值对
	if (ready.IDayCn == '初一') { //月初优先显示
		result = ready.IMonthCn;
	} else if (ready.Term) { //如果有节气的话，换成节气
		result = ready.Term;
	} else if (ready.festival) { //如果有节日的话，换成节日
		result = ready.festival;
	} else if (ready.lunarFestival) { //如果有中国传统的节日的话，换成传统节日（春节、元宵节、端午节）
		result = ready.lunarFestival;
	} else {
		result = ready.IDayCn; //都没有的话就是农历
	}
	if (ready.IMonthCn + ready.IDayCn === '七月初七') {
		result = '七夕'
	}
	// console.log(year, month, day, result, ready);
	return result
}

function bindEvents() {
	
	//绑定点击事件
	up.click(function () {
		today = today.subtract(1, 'month')
		randomDate(today);
	});
	down.click(function () {
		today = today.add(1, 'month')
		randomDate(today);
	});
	reset.click(function () {
		today = moment();
		randomDate(today);
	})
}
bindEvents();


//更新时间
setInterval(function () {
	randerTime1();
	randerTime2();
	randerTime3();
	wTitle();
}, 500)