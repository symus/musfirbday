const countdownMsg = document.getElementById('countdownMsg');
const timeDisplay = document.getElementById('timeDisplay');
const revealSection = document.getElementById('revealSection');
const gallery = document.getElementById('gallery');
const musicBtn = document.getElementById('musicBtn');
const controls = document.getElementById('controls');
const modalBack = document.getElementById('modalBack');
const modalMessage = document.getElementById('modalMessage');
const okBtn = document.getElementById('okBtn');
const balloonBtn = document.getElementById('balloonBtn');
const stopBalloonBtn = document.getElementById('stopBalloonBtn');
const musicStopBtn = document.getElementById('musicStopBtn');

const giftMessages = [
  'Check your first gift under the sofa.',
  'Find your second gift in the refrigerator.',
  'Your third gift is near the TV.',
  'Look under your pillow for the fourth gift.',
  'The fifth gift is in the cupboard.',
  'Your final gift is behind the curtain.'
];

gallery.style.display='none';
controls.style.display='none';

// Countdown to 27th Oct 2025
//const target = new Date('2025-10-27T00:00:00').getTime();
const target = Date.now() + 5000; // 5 seconds countdown

function updateTimer(){
  const now = Date.now();
  const diff = target - now;
  if(diff <= 0){
    clearInterval(timerHandle);
    revealSection.style.display='block';
    gallery.style.display='grid';
    controls.style.display='flex';
    countdownMsg.textContent='';
    timeDisplay.textContent='';
    return;
  }
  const days=Math.floor(diff/(1000*60*60*24));
  const hrs=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const mins=Math.floor((diff%(1000*60*60))/(1000*60));
  const secs=Math.floor((diff%(1000*60))/1000);
  timeDisplay.textContent=`${String(days).padStart(2,'0')} : ${String(hrs).padStart(2,'0')} : ${String(mins).padStart(2,'0')} : ${String(secs).padStart(2,'0')}`;
  countdownMsg.textContent=`${days}d ${hrs}h to go for Musfir's Birthday!`;
}
const timerHandle = setInterval(updateTimer,1000);
updateTimer();

// Simple Birthday Music
let audioCtx = null;
let isPlaying = false;
musicBtn.addEventListener('click', ()=>{
  if(isPlaying){
    if(audioCtx) audioCtx.close();
    isPlaying=false;
    musicBtn.textContent='Play Music';
  } else {
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const notes=[264,264,297,264,352,330,264,264,297,264,396,352,264,264,528,440,352,330,297,466,466,440,352,396,352];
    const dur=0.32;
    let t=audioCtx.currentTime+0.1;
    notes.forEach((f,i)=>{
      const o=audioCtx.createOscillator();
      const g=audioCtx.createGain();
      o.type='sine';
      o.frequency.value=f;
      o.connect(g);
      g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0,t+i*dur);
      g.gain.linearRampToValueAtTime(0.15,t+i*dur+0.01);
      g.gain.linearRampToValueAtTime(0.0001,t+i*dur+dur-0.05);
      o.start(t+i*dur);
      o.stop(t+i*dur+dur);
    });
    isPlaying=true;
    musicBtn.textContent='Stop Music';
  }
});

// Gallery gifts modal
document.querySelectorAll('.photo').forEach(photo=>{
  photo.addEventListener('click',()=>{
    const idx = Number(photo.dataset.index);
    modalMessage.textContent = giftMessages[idx];
    modalBack.style.display='flex';
  });
});
okBtn.addEventListener('click',()=>{ modalBack.style.display='none'; });
modalBack.addEventListener('click', e=>{ if(e.target===modalBack) modalBack.style.display='none'; });

// Balloons
let balloonInterval = null;
balloonBtn.addEventListener('click', ()=>{
  if(balloonInterval) return;
  balloonInterval = setInterval(()=>{
    const b = document.createElement('div');
    b.className='balloon';
    const size=30+Math.random()*40;
    b.style.width=size+'px';
    b.style.height=size*1.4+'px';
    b.style.left=Math.random()*90+'vw';
    b.style.backgroundColor=`hsl(${Math.random()*360},70%,60%)`;
    const duration=6+Math.random()*4;
    b.style.animation=`floatUp ${duration}s linear forwards, sway 2s ease-in-out infinite alternate`;
    document.body.appendChild(b);
    setTimeout(()=>b.remove(), duration*1000);
  }, 300);
});
stopBalloonBtn.addEventListener('click', ()=>{
  clearInterval(balloonInterval);
  balloonInterval=null;
