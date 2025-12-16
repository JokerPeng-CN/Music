// 播放按钮
var playPause = document.getElementsByClassName('playPause')[0];
// 音频ID
var audio = document.getElementById('audioTag');
// 上一首
var beforeMusic = document.getElementsByClassName('beforeMusic')[0];
// 下一首
var nextMusic = document.getElementsByClassName('nextMusic')[0];
// 歌曲信息
var musicTitle = document.getElementsByClassName('music-title')[0];
// 歌曲作者
var authorName = document.getElementsByClassName('author-name')[0];
// 获取时间
var playedTime = document.getElementsByClassName('played-time')[0];
// 获取结束事件
var totleTime = document.getElementsByClassName('audio-time')[0];
// 已播放进度条
var progressPlay = document.getElementsByClassName('progress-play')[0];
// 播放模式按钮
var playMode = document.getElementsByClassName('playMode')[0];
// 获取进度条
var volume = document.getElementsByClassName('volume')[0];
var volumnTogger = document.getElementById('volumn-togger');
// 获取倍数
var speed = document.getElementById('speed');
// 列表
var closeContainer = document.getElementsByClassName('close-container')[0];
var listContainer = document.getElementsByClassName('list-container')[0];
var list = document.getElementById('list');
var musicList = document.getElementsByClassName('music-list')[0];

// 添加MV相关变量
var mvContainer = document.getElementById('mvContainer');
var mvVideo = document.getElementById('mvVideo');
var closeMvBtn = document.getElementById('closeMv');
var mvButton = document.getElementById('MV');

// 歌曲列表名称
var musicData = [
  ['明天过后', '张杰'],
  ['等你下课', '周杰伦'],
  ['他不懂', '张杰'],
  ['枫', '周杰伦'],
];
// 获取body
var body = document.body;
// musicId
var musicId = 0;
// 专辑ID
var recordImg = document.getElementById('record-img')

// 初始化歌曲
function initMusic() {
  audio.src = `./mp3/music${musicId}.mp3`;
  audio.load();
  recordImg.classList.remove('rotate-play');
  // 页面元素加载完成
  audio.onloadedmetadata = function () {
    recordImg.style.backgroundImage = `url('static/img/record${musicId}.jpg')`;
    body.style.backgroundImage = `url('static/img/bg${musicId}.png')`;
    musicTitle.innerText = musicData[musicId][0];
    authorName.innerText = musicData[musicId][1];
    refreshRotate();
    totleTime.innerText = formatTime(audio.duration);
    audio.currentTime = 0;
  }
}

// 初始化并自动播放
function initAndPlay() {
  initMusic();
  rotateRecord();
  audio.play();
  playPause.classList.remove('icon-play');
  playPause.classList.add('icon-pause');
}

// 页面加载
initMusic();

// 点击播放暂停
playPause.addEventListener('click', function () {
  if (audio.paused) {
    audio.play();
    rotateRecord();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');
  } else {
    audio.pause();
    rotateRecordStop();
    playPause.classList.remove('icon-pause');
    playPause.classList.add('icon-play');
  }
})

// 跳转下一首
nextMusic.addEventListener('click', function () {
  musicId++;
  if (musicId >= musicData.length) {
    musicId = 0;
  }
  initAndPlay();
});

// 跳转上一首
beforeMusic.addEventListener('click', function () {
  musicId--;
  if (musicId < 0) {
    musicId = musicData.length - 1;
  }
  initAndPlay();
});

// 专辑旋转
function rotateRecord() {
  recordImg.style.animationPlayState = 'running';
}
// 停止专辑旋转
function rotateRecordStop() {
  recordImg.style.animationPlayState = 'paused';
}
// 刷新旋转角度
function refreshRotate() {
  recordImg.classList.add('rotate-play');
}

// 时间格式化
function formatTime(value) {
  var hour = parseInt(value / 3600);
  var minutes = parseInt((value % 3600) / 60);
  var seconds = parseInt(value % 60);

  if (hour > 0) {
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

audio.addEventListener('timeupdate', updateProgress);

// 音乐进度更新
function updateProgress() {
  playedTime.innerText = formatTime(audio.currentTime);
  var value = audio.currentTime / audio.duration;
  progressPlay.style.width = value * 100 + '%';
}

// 音乐播放模式
var modeId = 1;
playMode.addEventListener('click', function () {
  modeId++;
  if (modeId > 3) {
    modeId = 1;
  }
  playMode.style.backgroundImage = `url('static/img/mode${modeId}.png')`;
})

// 音乐播放完毕
audio.addEventListener('ended', function () {
  if (modeId == 2) {
    musicId = (musicId + 1) % musicData.length;
  } else if (modeId == 3) {
    var oldId = musicId;
    musicId = Math.floor(Math.random() * musicData.length);
    while (musicId == oldId) {
      musicId = Math.floor(Math.random() * musicData.length);
    }
  }
  initAndPlay();
})


// 记录上一次的音量
var lastVolume = 70;
audio.volume = lastVolume / 100;
// 音乐控制
volume.addEventListener('click', setVolume);
function setVolume() {
  if (audio.muted || audio.volume == 0) {
    audio.muted = false;
    audio.volume = lastVolume / 100;
  } else {
    audio.muted = true;
    lastVolume = volumnTogger.value;
    volumnTogger.value = 0;
  }
  updateVolumeIcon();
}
volumnTogger.addEventListener('input', updateVolume);
// 更新音量图标
function updateVolumeIcon() {
  if (audio.muted) {
    volume.style.backgroundImage = `url('static/img/静音.png')`;
  } else {
    volume.style.backgroundImage = `url('static/img/音量.png')`;
  }
}

// 音量滑动
function updateVolume() {
  const volumeValue = volumnTogger.value / 100;
  audio.volume = volumeValue;
  if (volumeValue === 0) {
    audio.muted = true;
  } else {
    audio.muted = false;
  }
  updateVolumeIcon();
}

// 倍数速
speed.addEventListener('click', setSpeed);
function setSpeed() {
  if (audio.playbackRate == 1) {
    audio.playbackRate = 1.5;
    speed.innerHTML = '1.5x';
  } else if (audio.playbackRate == 1.5) {
    audio.playbackRate = 2;
    speed.innerHTML = '2.0x';
  } else {
    audio.playbackRate = 1;
    speed.innerHTML = '1.0x';
  }
}

// 列表
list.addEventListener('click', function () {
  listContainer.classList.remove('list-hide');
  listContainer.classList.add('list-show');
  closeContainer.style.display = 'block';
  listContainer.style.display = 'block';
})

closeContainer.addEventListener('click', function () {
  listContainer.classList.remove('list-show');
  listContainer.classList.add('list-hide');
  closeContainer.style.display = 'none';
  // listContainer.style.display = 'none';
})

// 自动生成音乐列表
function createMusicList() {
  for (let i = 0; i < musicData.length; i++) {
    // 生成div容器
    let div = document.createElement('div');
    div.innerText = `${musicData[i][0]}`;
    musicList.appendChild(div);
    div.addEventListener('click', function () {
      // 播放音乐
      musicId = i;
      initAndPlay();
      // 关闭列表
      listContainer.classList.remove('list-show');
      listContainer.classList.add('list-hide');
    });
  }
}

// 添加MV功能
function openMV() {
  // 暂停音频播放
  if (!audio.paused) {
    audio.pause();
    playPause.classList.remove('icon-pause');
    playPause.classList.add('icon-play');
    rotateRecordStop();
  }

  // 设置并播放对应MV
  mvVideo.src = `./mp4/video${musicId}.mp4`;
  mvVideo.load();
  mvVideo.play();

  // 显示MV容器
  mvContainer.style.display = 'flex';
}

function closeMV() {
  // 暂停MV播放
  mvVideo.pause();
  mvVideo.currentTime = 0;

  // 隐藏MV容器
  mvContainer.style.display = 'none';

  // 如果之前在播放音乐，则恢复播放
  if (playPause.classList.contains('icon-pause')) {
    audio.play();
    rotateRecord();
  }
}

// 绑定MV按钮事件
mvButton.addEventListener('click', openMV);
closeMvBtn.addEventListener('click', closeMV);

// 点击MV容器背景也关闭MV（可选）
mvContainer.addEventListener('click', function (e) {
  if (e.target === mvContainer) {
    closeMV();
  }
});

document.addEventListener('DOMContentLoaded', createMusicList);