import {readFile, writeFile, stat} from 'node:fs/promises';

// Derive a standard glTF line mesh from each triangle edge, without CAD sources.
export async function prepareWireframe(source, target) {
  const modified = Math.max((await stat(source)).mtimeMs, (await stat(new URL(import.meta.url))).mtimeMs);
  try { if ((await stat(target)).mtimeMs >= modified) return; } catch {}
  const file = await readFile(source);
  const jsonLength = file.readUInt32LE(12);
  const input = JSON.parse(file.subarray(20, 20 + jsonLength).toString());
  const binary = file.subarray(28 + jsonLength);
  const output = {
    asset: {version:'2.0', generator:'Portfolio wireframe'},
    scene:input.scene, scenes:input.scenes, nodes:input.nodes, meshes:[],
    // Native WebGL lines have a one-pixel minimum. Low coverage makes them
    // visually finer without increasing rendering resolution or removing edges.
    materials:[{pbrMetallicRoughness:{baseColorFactor:[.015,.025,.06,.28]},alphaMode:'BLEND',extensions:{KHR_materials_unlit:{}}}],
    extensionsUsed:['KHR_materials_unlit'], buffers:[], bufferViews:[], accessors:[],
  };
  const chunks=[]; let offset=0;
  const add=(bytes,accessor,target)=>{
    const bufferView=output.bufferViews.push({buffer:0,byteOffset:offset,byteLength:bytes.length,target})-1;
    chunks.push(bytes);offset+=bytes.length;
    const padding=(4-offset%4)%4;if(padding){chunks.push(Buffer.alloc(padding));offset+=padding;}
    return output.accessors.push({...accessor,bufferView,byteOffset:0})-1;
  };
  const bytesFor=index=>{
    const accessor=input.accessors[index],view=input.bufferViews[accessor.bufferView];
    if(view.byteStride)throw Error('Wireframe conversion expects packed geometry');
    const start=(view.byteOffset||0)+(accessor.byteOffset||0);
    const width=accessor.componentType===5123?2:4;
    return binary.subarray(start,start+accessor.count*(accessor.type==='VEC3'?3:1)*width);
  };
  for(const mesh of input.meshes){
    const positions=new Map(),primitives=[];
    for(const primitive of mesh.primitives){
      const originalPosition=primitive.attributes.POSITION;
      if(!positions.has(originalPosition))positions.set(originalPosition,add(bytesFor(originalPosition),input.accessors[originalPosition],34962));
      const vertexCount=input.accessors[originalPosition].count;
      const accessor=input.accessors[primitive.indices],bytes=bytesFor(primitive.indices);
      const read=accessor.componentType===5123?i=>bytes.readUInt16LE(i*2):i=>bytes.readUInt32LE(i*4);
      const edges=new Set(),indices=[];
      const edge=(a,b)=>{const low=Math.min(a,b),high=Math.max(a,b),key=low*vertexCount+high;if(!edges.has(key)){edges.add(key);indices.push(low,high);}};
      for(let i=0;i<accessor.count;i+=3){const a=read(i),b=read(i+1),c=read(i+2);edge(a,b);edge(b,c);edge(c,a);}
      const packed=Buffer.from(new Uint32Array(indices).buffer);
      primitives.push({attributes:{POSITION:positions.get(originalPosition)},indices:add(packed,{componentType:5125,count:indices.length,type:'SCALAR'},34963),material:0,mode:1});
    }
    output.meshes.push({name:mesh.name,primitives});
  }
  output.buffers=[{byteLength:offset}];
  let json=Buffer.from(JSON.stringify(output));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
  const header=Buffer.alloc(20),binHeader=Buffer.alloc(8);
  header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+offset,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
  binHeader.writeUInt32LE(offset);binHeader.writeUInt32LE(0x004e4942,4);
  await writeFile(target,Buffer.concat([header,json,binHeader,...chunks]));
}
