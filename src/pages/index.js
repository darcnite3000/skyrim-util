import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

function TrackControl({title,color='black',value=0,max=-1,count=15,final=-1, levelUpAvailable=false,onChange=()=>{},onLevelUp=()=>{}}){
  return (<div>
    <label data={value} className={`font-bold`}>{title}</label>
    <div className='flex flex-row'>
      {[...Array(16).keys()].map((i)=>{
        const background = (i==value)?color:(i==final)?'black':(levelUpAvailable && i==max+1)?color:'inherit'
        const box = <div style={{backgroundColor:background}} className={`border-4 rounded-md m-1 p-5 ${i>max?((levelUpAvailable && i==max+1)?'border-yellow-500 opacity-50':'border-gray'):'border-black'}`}></div>
        return (<div key={i} id={`${title}-${i}`} onClick={()=>{
          if(i <= max){
            onChange(i)
          }
          if((levelUpAvailable && i==max+1)){
            onLevelUp(title)
          }
        }}>{box}</div>)
      })}
    </div>
  </div>)
}

function RangeControl({title, value=0, min=0, max=-1,showMax=false,color='red', onChange=()=>{}}){
  function increment(){
    if(max!=-1 && value>max){
      onChange(max)
    }else if(max==-1 || value<max){
      onChange(value+1)
    }
  }
  function decrement(){
    if(min!=-1 && value<min){
      onChange(min)
    }else if(min==-1 || value>min){
      onChange(value-1)
    }
  }
  return (
  <div className='flex flex-col justify-center items-center'>
    <label className='range-title font-bold'>{title}</label>
    <div className='flex flex-row w-full items-center justify-center range-selector'>
      <button className={`py-2 px-3 rounded-l-full bg-${color}-500 hover:bg-${color}-700 text-white font-bold`} onClick={decrement}>-</button>
      <div className={`py-2 px-3 bg-${color}-500 text-white font-bold`}>{value}{(showMax)?`/${max}`:''}</div>
      <button className={`py-2 px-3 rounded-r-full bg-${color}-500 hover:bg-${color}-700 text-white font-bold`} onClick={increment}>+</button>
    </div>
  </div>
  )
}

export default function Home() {
  const levelLimit = [7,8,10]
  const [status, setStatus] = useState({
    level: 0,
    exp: 0,
    septim: 0,
    health: {
      value: 5,
      max: 5,
      min: 0,
      final: 1
    },
    stamina: {
      value: 5,
      max: 5,
      min: 0,
    },
    magicka: {
      value: 5,
      max: 5,
      min: 0,
    },
    resources: {
      plants: 0,
      gems: 0,
      ore: 0,
    },
    skills: []
  })
  const expNeeded = (levelLimit.length <= status.level)?levelLimit[levelLimit.length-1]:levelLimit[status.level]
  const levelUpAvailable = status.exp == expNeeded
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className='flex justify-between items-center w-5/6'>
        <div className='flex flex-row text-2xl font-bold'><label className='pe-1'>Level</label><div>{status.level}</div></div>
        <RangeControl title='Experience' color='violet' onChange={(val) => {
          setStatus({...status,exp:val})
        }} value={status.exp} showMax={true} max={expNeeded} />
        <RangeControl title='Septim' color='yellow' onChange={(val) => {
          setStatus({...status,septim:val})
        }} value={status.septim} />
        <RangeControl title='Plant' color='lime' onChange={(val) => {
          setStatus({...status,resources:{...status.resources,plants:val}})
        }} value={status.resources.plants} />
        <RangeControl title='SoulStone' color='sky' onChange={(val) => {
          setStatus({...status,resources:{...status.resources,gems:val}})
        }} value={status.resources.gems} />
        <RangeControl title='Ore' color='slate' onChange={(val) => {
          setStatus({...status,resources:{...status.resources,ore:val}})
        }} value={status.resources.ore} />
        <RangeControl title='Final Blow' color='orange' onChange={(val) => {
          setStatus({...status,health:{...status.health,final:val}})
        }} value={status.health.final} />
      </div>
      <div className='flex flex-col justify-between items-center w-5/6'>
        <TrackControl title='Strength' onLevelUp={() => {
          if(status.exp == expNeeded){
            setStatus({...status,exp:0,level:status.level+1,health:{...status.health,value:status.health.max+1,max:status.health.max+1}})
          }
        }}
        onChange={(i)=>{
            setStatus({...status,health:{...status.health,value:i}})
        }}
        {...status.health} color='red' levelUpAvailable={levelUpAvailable} />
        <TrackControl title='Stamina' onLevelUp={() => {
          if(status.exp == expNeeded){
            setStatus({...status,exp:0,level:status.level+1,stamina:{...status.stamina,value:status.stamina.max+1,max:status.stamina.max+1}})
          }
        }}
        onChange={(i)=>{
            setStatus({...status,stamina:{...status.stamina,value:i}})
        }}
        {...status.stamina} color='green' levelUpAvailable={levelUpAvailable} />
        <TrackControl title='Magicka' onLevelUp={() => {
          if(status.exp == expNeeded){
            setStatus({...status,exp:0,level:status.level+1,magicka:{...status.magicka,value:status.magicka.max+1,max:status.magicka.max+1}})
          }
        }}
        onChange={(i)=>{
            setStatus({...status,magicka:{...status.magicka,value:i}})
        }}
        {...status.magicka} color='blue' levelUpAvailable={levelUpAvailable} />
        <div className='flex justify-around mt-3'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={()=>{setStatus({...status,stamina:{...status.stamina,value:status.stamina.max},magicka:{...status.magicka,value:status.magicka.max}})}}>End Battle</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={()=>{setStatus({...status,stamina:{...status.stamina,value:status.stamina.max},health:{...status.health,value:status.health.max},magicka:{...status.magicka,value:status.magicka.max}})}}>End Combat</button>
        </div>
      </div>
      <div>
        <div>Skills</div>
      </div>
    </main>
  )
}
