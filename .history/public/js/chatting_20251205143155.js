 // Lightweight local UI logic for demo + animations
    const messages = document.getElementById('messages');
    const input = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const backBtn = document.getElementById('backBtn');

    backBtn.addEventListener('click', ()=>{
      backBtn.style.transform = 'translateZ(2px) rotateX(2deg)';
      setTimeout(()=>backBtn.style.transform = '',160);
      // small visual confirm
      backBtn.animate([{boxShadow: '0 10px 30px rgba(96,165,250,0.08)'},{boxShadow:'0 22px 60px rgba(96,165,250,0.14)'}],{duration:360,fill:'forwards'});
      // demo: flash a message
      appendSystem('You pressed Back — replace with your navigation.');
    });

    function appendSystem(text){
      const el = document.createElement('div');
      el.className = 'msg-row';
      el.innerHTML = `<div class="msg in animate" style="max-width:70%">${escapeHtml(text)}<span class="meta">System</span></div>`;
      messages.appendChild(el);messages.scrollTop = messages.scrollHeight;
    }

    function escapeHtml(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}

    function appendMessage(text, outgoing=false){
      const row = document.createElement('div');
      row.className = 'msg-row' + (outgoing? ' out' : '');

      const toolbar = `<div class="msg-toolbar">
                        <div class="action-pill">👍</div>
                        <div class="action-pill">❤️</div>
                        <div class="action-pill">⋯</div>
                      </div>`;

      const bubbleClass = outgoing? 'msg out' : 'msg in';
      const bubble = document.createElement('div');
      bubble.className = bubbleClass + ' animate';
      bubble.innerHTML = toolbar + `<div class="text">${escapeHtml(text)}</div><span class="meta">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>`;

      row.appendChild(bubble);
      messages.appendChild(row);
      // tiny entrance tilt for outgoing messages
      if(outgoing){bubble.animate([{transform:'translateY(6px) rotateX(6deg)'},{transform:'translateY(0) rotateX(0)'}],{duration:420,easing:'cubic-bezier(.2,.9,.2,1)'});} 

      messages.scrollTop = messages.scrollHeight + 200;

      // focus on hover for keyboard users
      bubble.addEventListener('mouseover', ()=>bubble.style.transform = 'translateY(-8px) translateZ(8px) rotateX(3deg)');
      bubble.addEventListener('mouseout', ()=>bubble.style.transform = '');

      return bubble;
    }

    sendBtn.addEventListener('click', ()=>{const v = input.value.trim(); if(!v) return; appendMessage(v,true); input.value=''; input.focus();});
    input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); sendBtn.click(); } });