(function() {

const elms = {
	clock: document.getElementById('clock'),
	break: document.querySelector('#break > span'),
	session: document.querySelector('#session > span'),
	activity: document.getElementById('activity'),
	countdown: document.getElementById('countdown'),
	buttons: Array.from(document.querySelectorAll('button')),
	breakStart: document.getElementById('break-start'),
	breakEnd: document.getElementById('break-end')
};

elms.buttons.forEach(btn => btn.onclick = function() {
	if(clockObj.running) return;

	const parent = this.parentElement.id;

	const change = this.textContent == '-' ? -1 : 1;
	const current = Number(elms[parent].textContent);
	const newTime = current + change || 1;

	elms[parent].textContent = newTime;

	if((parent == 'session' && !elms.clock.classList.contains('break')) ||
		 (parent == 'break' && elms.clock.classList.contains('break'))) {
		elms.countdown.textContent = newTime;
		delete clockObj.theTime;
	}
});

const clockObj = {
	theTime: undefined,
	interval: undefined,
	nextActivity: 'session',
	activity: {'session': 'Session', 'break': 'Break!'},
	running: false,
	pxRun: 0,
	pxPerSec: 0
};

clock.onclick = () => toggleClock();

function toggleClock() {
	if(clockObj.theTime === undefined) {
		clockObj.pxRun = 0;

		elms.activity.textContent = clockObj.activity[clockObj.nextActivity];

		clockObj.theTime = 
			new TimeKeeping(elms[clockObj.nextActivity].textContent);
		
		if(clockObj.nextActivity == 'session') {
			clock.classList.remove('break');
			clockObj.nextActivity == 'break';
		}
		else {
			clock.classList.add('break');
			clockObj.nextActivity == 'session';
		}

		clockObj.running = false;
		clockObj.pxPerSec = 290.0 / clockObj.theTime.getTotal();
		clockObj.pxRun = 0;

		goUp();
	}

	if(clockObj.running) {
		clockObj.running = false;
		window.clearInterval(clockObj.interval);
		delete clockObj.interval;
	}
	else {
		clockObj.running = true;
		clockObj.interval = setInterval(() => runClock(), 1000);
	}
}

const runClock = () => {
	const currentTick = clockObj.theTime.tick();

	goUp();
	
	if(currentTick.timeOut) {
		clockObj.nextActivity = 
			(clockObj.nextActivity == 'session') ? 'break' : 'session';
		delete clockObj.theTime;
		window.clearInterval(clockObj.interval);
		delete clockObj.interval;
		clockObj.running = false;
		toggleClock();
	}
	else {
		elms.countdown.textContent = currentTick;
		if(currentTick == '0:00' && clockObj.nextActivity == 'session') {
			elms.breakStart.load();
			elms.breakStart.play();
		}
		else if(currentTick == '0:05' && clockObj.nextActivity == 'break') {
			elms.breakEnd.load();
			elms.breakEnd.play();
		}
	}
};

function goUp() {
	if(clockObj.pxRun < 290) {
		clock.style.backgroundSize = '290px ' + clockObj.pxRun + 'px';
		clockObj.pxRun += clockObj.pxPerSec;
	}
	else {
		clock.style.backgroundSize = '290px 290px';
	}
}

const TimeKeeping = function(minutes, seconds) {
	const time = {
		hours: Math.floor(minutes / 60),
		minutes: minutes % 60,
		seconds: seconds || 0,
		totalSeconds: minutes * 60 + (seconds || 0)
	}
	function getTime(h=time.hours, m=time.minutes, s=time.seconds) {
		const sStr = s > 9 ? ':' + s : ':0' + s;
		const mStr = h < 1 ? m : ':' + (m > 9 ? m : '0' + m);
		const hStr = h > 0 ? h : '';
		return hStr + mStr + sStr;
	}
	this.getTotal = () => time.totalSeconds;
	this.tick = () => {
		if(time.seconds !== 0) {
			time.seconds--;
		}
		else if(time.minutes !== 0) {
			time.seconds = 59;
			time.minutes--;
		}
		else if(time.hours !== 0) {
			time.minutes = 59;
			time.seconds = 59;
			time.hours--;
		}
		else {
			return {timeOut:true};
		}
		return getTime();
	};
};

})();