for(const gallery of document.querySelectorAll('[data-carousel]')){
  const track=gallery.querySelector('.gallery-track'),slides=[...gallery.querySelectorAll('.gallery-slide')],controls=gallery.querySelector('.gallery-controls');
  let index=0,swiped=false;
  if(controls){gallery.classList.add('is-carousel');controls.hidden=false;}
  const show=next=>{index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==index);if(controls)controls.querySelector('.gallery-count').textContent=`${index+1} / ${slides.length}`;};
  controls?.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>show(index+Number(button.dataset.direction))));
  gallery.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}});
  let start=null;
  track.addEventListener('touchstart',event=>{start=event.touches[0].clientX;swiped=false;},{passive:true});
  track.addEventListener('touchend',event=>{if(start!==null&&Math.abs(event.changedTouches[0].clientX-start)>45){swiped=true;show(index+(event.changedTouches[0].clientX<start?1:-1));}start=null;},{passive:true});
  const dialog=document.createElement('dialog');
  dialog.className='image-viewer';dialog.setAttribute('aria-label',gallery.getAttribute('aria-label'));
  dialog.innerHTML='<header><button class="image-viewer-close" type="button" autofocus></button></header><div class="image-viewer-stage"><img alt=""></div><footer><p class="image-viewer-caption" aria-live="polite"></p><div class="image-viewer-navigation"><button type="button" data-step="-1">←</button><span class="image-viewer-count"></span><button type="button" data-step="1">→</button></div></footer>';
  document.body.append(dialog);
  const close=dialog.querySelector('.image-viewer-close');close.textContent=gallery.dataset.close+' ×';
  dialog.querySelector('[data-step="-1"]').setAttribute('aria-label',gallery.dataset.previous);
  dialog.querySelector('[data-step="1"]').setAttribute('aria-label',gallery.dataset.next);
  dialog.querySelector('.image-viewer-navigation').hidden=slides.length<2;
  const display=next=>{
    show(next);
    const original=slides[index].querySelector('img'),image=dialog.querySelector('img');
    image.src=original.currentSrc||original.src;image.alt=original.alt;
    dialog.querySelector('.image-viewer-caption').textContent=original.alt;
    dialog.querySelector('.image-viewer-count').textContent=`${index+1} / ${slides.length}`;
  };
  slides.forEach((slide,i)=>{
    slide.querySelector('.image-fullscreen').hidden=false;
    const frame=slide.querySelector('.gallery-image');frame.classList.add('can-expand');
    frame.addEventListener('click',()=>{
      if(swiped){swiped=false;return;}
      display(i);dialog.showModal();document.documentElement.classList.add('image-viewer-open');
    });
  });
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    document.documentElement.classList.remove('image-viewer-open');
    slides[index].querySelector('.image-fullscreen').focus({preventScroll:true});
  });
  dialog.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>display(index+Number(button.dataset.step))));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();display(index+(event.key==='ArrowRight'?1:-1));}
  });
  show(0);
}

for(const shell of document.querySelectorAll('[data-model]')){
  const stage=shell.querySelector('.model-stage'),status=shell.querySelector('.model-status');
  const controls=shell.querySelector('.model-tools'),wireframe=controls.querySelector('.wireframe-model'),reset=controls.querySelector('.reset-model');
  const busy=value=>{shell.setAttribute('aria-busy',String(value));wireframe.disabled=value;reset.disabled=value;};
  const initialize=async()=>{
    busy(true);status.textContent=shell.dataset.loading;
    try{
      await import('./vendor/model-viewer.min.js');
      const viewer=document.createElement('model-viewer');
      viewer.setAttribute('alt',shell.dataset.alt);viewer.setAttribute('camera-controls','');viewer.setAttribute('touch-action','pan-y');viewer.setAttribute('interaction-prompt','none');viewer.setAttribute('environment-image','neutral');viewer.setAttribute('camera-orbit','35deg 70deg 120%');viewer.setAttribute('exposure','0.8');viewer.setAttribute('loading','eager');
      let desiredWireframe=false,lastSource=null,savedView=null,failed=false;
      viewer.addEventListener('load',()=>{
        if(savedView){viewer.cameraOrbit=savedView.orbit;viewer.cameraTarget=savedView.target;viewer.fieldOfView=savedView.fov;viewer.jumpCameraToGoal();}
        lastSource=viewer.src;
        shell.querySelector('.model-poster').hidden=true;
        viewer.classList.add('is-ready');controls.hidden=false;
        shell.dataset.loaded='true';shell.dataset.mode=desiredWireframe?'wireframe':'solid';
        wireframe.setAttribute('aria-pressed',String(desiredWireframe));
        status.textContent=failed?shell.dataset.error:'';busy(false);
      });
      viewer.addEventListener('error',()=>{
        status.textContent=shell.dataset.error;failed=true;busy(false);
        // Restore the previous view if a mode fails to load; keep the poster on initial failure.
        if(lastSource&&viewer.src!==lastSource){desiredWireframe=lastSource.endsWith('/wireframe.glb');busy(true);viewer.src=lastSource;}
        else if(!lastSource)viewer.hidden=true;
      });
      viewer.src=shell.dataset.model;
      stage.append(viewer);
      wireframe.addEventListener('click',()=>{
        const orbit=viewer.getCameraOrbit(),target=viewer.getCameraTarget();
        savedView={orbit:`${orbit.theta}rad ${orbit.phi}rad ${orbit.radius}m`,target:`${target.x}m ${target.y}m ${target.z}m`,fov:`${viewer.getFieldOfView()}deg`};
        desiredWireframe=wireframe.getAttribute('aria-pressed')!=='true';failed=false;
        busy(true);status.textContent=shell.dataset.loading;shell.dataset.loaded='false';
        viewer.src=desiredWireframe?shell.dataset.wireframe:shell.dataset.model;
      });
      reset.addEventListener('click',()=>{savedView=null;viewer.cameraOrbit='35deg 70deg 120%';viewer.cameraTarget='auto auto auto';viewer.fieldOfView='auto';viewer.jumpCameraToGoal();});
      const full=shell.querySelector('.fullscreen-model');
      if(!shell.requestFullscreen)full.hidden=true;
      else full.addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();else shell.requestFullscreen().catch(()=>{});});
    }catch{status.textContent=shell.dataset.error;busy(false);}
  };
  initialize();
}
