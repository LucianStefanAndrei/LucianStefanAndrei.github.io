import { mkdir, readdir, readFile, writeFile, stat, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const require = createRequire(import.meta.url);
const folders = { Amnesia:'amnesia', BastonNevazatori:'assistive-cane', Brat_Pneumatic:'pneumatic-arm', CelulaProducereRotiDintate:'robodk', Piesa_GCode:'cnc-milling', ReductorMelcat:'gearbox', RobotAntropomorf:'museum-robot', Schimbator_Scule:'tool-changer' };
const run = (cmd,args) => new Promise((resolve,reject)=> { const child=spawn(cmd,args,{stdio:['ignore','ignore','pipe']});let error='';child.stderr.on('data',data=>{error=(error+data).slice(-3000)});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(error))); });
const newer = async (out,source) => { try { return (await stat(out)).mtimeMs >= (await stat(source)).mtimeMs; } catch { return false; } };

// Store the actual triangulated STEP geometry as a compact standard GLB.
function toGLB(meshes) {
  const doc={asset:{version:'2.0',generator:'Portfolio STEP conversion / OpenCascade'},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[]};
  const chunks=[];let offset=0;
  const add=(array,type,componentType,target,min,max)=>{
    const bytes=Buffer.from(array.buffer,array.byteOffset,array.byteLength);
    const view=doc.bufferViews.push({buffer:0,byteOffset:offset,byteLength:bytes.length,target})-1;
    chunks.push(bytes);offset+=bytes.length;
    const pad=(4-offset%4)%4;if(pad){chunks.push(Buffer.alloc(pad));offset+=pad;}
    return doc.accessors.push({bufferView:view,componentType,count:array.length/(type==='VEC3'?3:1),type,...(min?{min,max}:{})})-1;
  };
  const colorMap=new Map();
  const material=color=>{const c=color||[.55,.62,.75],key=c.join(',');if(!colorMap.has(key)){colorMap.set(key,doc.materials.length);doc.materials.push({pbrMetallicRoughness:{baseColorFactor:[...c,1],metallicFactor:.15,roughnessFactor:.6},doubleSided:true});}return colorMap.get(key);};
  for(const mesh of meshes){
    const positions=new Float32Array(mesh.attributes.position.array);
    // CAD Z-up in millimetres -> glTF Y-up in metres.
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<positions.length;i+=3){const y=positions[i+1];positions[i]/=1000;positions[i+1]=positions[i+2]/1000;positions[i+2]=-y/1000;for(let a=0;a<3;a++){min[a]=Math.min(min[a],positions[i+a]);max[a]=Math.max(max[a],positions[i+a]);}}
    const attributes={POSITION:add(positions,'VEC3',5126,34962,min,max)};
    if(mesh.attributes.normal){const normals=new Float32Array(mesh.attributes.normal.array);for(let i=0;i<normals.length;i+=3){const y=normals[i+1];normals[i+1]=normals[i+2];normals[i+2]=-y;}attributes.NORMAL=add(normals,'VEC3',5126,34962);}
    const groups=new Map();
    const faces=mesh.brep_faces?.length?mesh.brep_faces:[{first:0,last:mesh.index.array.length/3-1}];
    for(const face of faces){const mat=material(face.color||mesh.color);if(!groups.has(mat))groups.set(mat,[]);const group=groups.get(mat);for(let i=face.first*3;i<(face.last+1)*3;i++)group.push(mesh.index.array[i]);}
    const primitives=[...groups].map(([mat,indices])=>({attributes,indices:add(new Uint32Array(indices),'SCALAR',5125,34963),material:mat}));
    const index=doc.meshes.push({name:mesh.name,primitives})-1;
    doc.scenes[0].nodes.push(doc.nodes.push({name:mesh.name,mesh:index})-1);
  }
  doc.buffers.push({byteLength:offset});
  let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
  const bin=Buffer.concat(chunks),header=Buffer.alloc(12),jh=Buffer.alloc(8),bh=Buffer.alloc(8);
  header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+bin.length,8);
  jh.writeUInt32LE(json.length);jh.writeUInt32LE(0x4e4f534a,4);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);
  return Buffer.concat([header,jh,json,bh,bin]);
}

const mode=process.argv[2]||'all';
let occt;
for(const [folder,id] of Object.entries(folders)){
  const sourceDir=`public/projects/${folder}`,outDir=`assets/media/projects/${id}`;
  await mkdir(outDir,{recursive:true});
  const files=await readdir(sourceDir);
  for(const file of files){
    const source=path.join(sourceDir,file);
    if(/\.step$/i.test(file)&&(mode==='all'||mode==='cad')){
      const target=`${outDir}/model.glb`;
      if(!await newer(target,source)){
        console.log(`Converting STEP: ${id}`);
        occt ||= await require('occt-import-js')();
        const result=occt.ReadStepFile(new Uint8Array(await readFile(source)),{linearUnit:'millimeter',linearDeflectionType:'bounding_box_ratio',linearDeflection:0.001,angularDeflection:0.35});
        if(!result.success||!result.meshes.length)throw Error(`STEP import failed: ${source}`);
        await writeFile(target,toGLB(result.meshes));
        console.log(`Converted ${id}: ${result.meshes.length} meshes, ${Math.round((await stat(target)).size/1024)} KB`);
      }
    }
    if(/\.mp4$/i.test(file)&&(mode==='all'||mode==='video')){
      const target=`${outDir}/video.mp4`;
      if(!await newer(target,source)){
        console.log(`Encoding video: ${id}`);
        await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vf',"scale='min(1280,iw)':-2",'-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',target]);
        await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','2','-i',source,'-frames:v','1','-vf',"scale='min(1280,iw)':-2",`${outDir}/poster.jpg`]);
        console.log(`Encoded ${id}: ${Math.round((await stat(target)).size/1024/1024)} MB`);
      }
    }
    if(/\.(png|jpe?g)$/i.test(file)&&(mode==='all'||mode==='images')){
      if(!await newer(`${outDir}/${file}`,source))await copyFile(source,`${outDir}/${file}`);
    }
  }
}
