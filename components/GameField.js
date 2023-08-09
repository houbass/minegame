import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";

//pic
import bitcoin from "pic/bitcoin.svg";
import mine from "pic/mine.svg";
import ground from "pic/ground.svg";


export default function GameField({ goldNuggets, setGoldNuggets, gold, setGold, beginDiggingPath, diggingPaths, setDiggingPaths, fieldWidth, costs, setCosts, fieldScale, topOffset }) {

    const [errCoordinates, setErrCoordinates] = useState({});
    const [errText, setErrText] = useState("");
    const [errClass, setErrClass] = useState("0");
    //page size settings
    const maxTop = goldNuggets.map((item) => item.top)
    const fieldHeight = Math.max(...maxTop) + 300;

    //random range
    function randomRange(min, max) {

        return min + (Math.random() * (max - min))
    }


    function errtextFun(text, left, top) {
        const errElement = document.createElement("p");
        errElement.innerText = text;
        errElement.className = "errtext animateErr";
        errElement.style = `
            top:${top}px; 
            left:${left}px; 
            `
        //document.body.appendChild(errElement);
        document.getElementById("gamefield").appendChild(errElement);

        setTimeout(() => {
            document.getElementById("gamefield").removeChild(errElement);
        }, 2100);
    }

    //START DIGGING
    function startDigging(item) {

        //filtering finished paths
        const finishedPaths = diggingPaths.filter((item) => item.digging === false)

        //filtering active mines
        const activeMines = goldNuggets.filter((item) => item.digging === true)
        
        const mx = item.left + item.size + 10;
        const my = item.top + (item.size / 2) - 10;

        if(activeMines.length > 2){
            const text = "ONLY 3 MINERS CAN WORK AT ONCE"
            errtextFun(text, mx, my)
        }
        else{
            
            //DIGGING
            //nejblizsi digging path
            if(finishedPaths.length > 0){
                const lengths = []
                for(let i=0; i < finishedPaths.length; i++){
                    const x = finishedPaths[i].x2;
                    const y = finishedPaths[i].y2;

                    const deltaX = x - (item.left + (item.size / 2));
                    const deltaY = y - ((item.top - topOffset)  + (item.size / 2));

                    const l = Math.round(Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2)));
                    lengths.push(l)
                }
                //nejbližší
                const nearestPathIndex = lengths.indexOf(Math.min(...lengths));
                const nearestX = finishedPaths[nearestPathIndex].x2
                const nearestY = finishedPaths[nearestPathIndex].y2

                console.log(costs + Math.min(...lengths))
                console.log(gold)
                if((costs + Math.min(...lengths)) < gold){

                    //costs
                    setCosts(costs + Math.min(...lengths))

                    //change GoldNuggets states
                    setGoldNuggets(goldNuggets.map((data) => {
                        if(item.index === data.index){

                            return {
                                ...data, 
                                digging: true,
                                time: (Date.now()),
                                timeNeed: Math.min(...lengths) * 100
                            }
                        }

                        return data;
                    }))
                    
                    //digging paths
                    setDiggingPaths([
                        ...diggingPaths, {
                            x1: nearestX,
                            y1: nearestY,
                            x2: item.left + (item.size / 2),
                            y2: (item.top - topOffset) + (item.size / 2),
                            timeNeed: Math.min(...lengths) * 100,
                            time: (Date.now()),
                            index: diggingPaths.length + 1,
                            digging: true,
                        }
                    ])
                }else{
                    const text = "NOT ENOUGH GOLD TO DIG HERE"
                    errtextFun(text, mx, my)
                }
            }else{
                if(costs + 100 <= gold){
                    //costs
                    setCosts(costs + 100)


                    //change GoldNuggets states
                    setGoldNuggets(goldNuggets.map((data) => {
                        if(item.index === data.index){

                            return {
                                ...data, 
                                digging: true,
                                time: (Date.now()),
                            }
                        }

                        return data;
                    }))

                    setDiggingPaths([
                        ...diggingPaths, {
                            x1: beginDiggingPath.x1,
                            y1: beginDiggingPath.y1,
                            x2: item.left + (item.size / 2),
                            y2: (item.top - topOffset) + (item.size / 2),
                            timeNeed: item.timeNeed,
                            time: (Date.now()),
                            index: diggingPaths.length + 1,
                            digging: true,
                        }
                    ])
                }else{
                    const text = "NOT ENOUGH GOLD TO DIG HERE"
                    errtextFun(text, mx, my)
                }
            }
        }
    }


    //console.log(diggingPaths)
    //FINISH MINING
    async function deleteIt(item) {
        const randomSize = randomRange(30, 80);

        await setGoldNuggets(goldNuggets.map((data) => {
            if(item.index === data.index){

                return {
                    ...data, 
                    digging: false,
                    time: null,
                    size: randomSize,
                    top: item.top + 100,
                    left: randomRange(10, fieldWidth - 90),
                    radius: randomRange(0, 50), 
                    timeNeed: (item.top + 100) * 100
                }
            }

            return data;
        }))

        setGold(gold + (Math.round(randomSize * 2.5)));
    }

    async function finishedPathFun(item) {

        await setDiggingPaths(diggingPaths.map((data) => {
            if(item.index === data.index){

                return {
                    ...data, 
                    digging: false,
                    time: null,
                    timeNeed: 0
                }
            }

            return data;
        }))
    }


    return(
        <>
        <div 
        className="gamefield" 
        id="gamefield" 
        style={{
            width: fieldWidth,
            height: fieldHeight,
            transform: `scale(${fieldScale})`,
            transformOrigin: "top",
            backgroundImage: `url(${ground.src})`,
            backgroundSize: "700px 700px",
            backgroundPositionY: "435px",
            backgroundPositionX: "50px",
            backgroundAttachment: "fixed",
        }}>
            <div
            style={{
                height: topOffset,
                width:"100%",
                backgroundImage: "linear-gradient(to bottom right, orange, pink)",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "center"
            }}>
                <Image 
                width={300} 
                src={mine} 
                style={{
                    //marginTop: "152px",
                    //background: "orange",
                    paddingRight: "50px"
                    
                    
                }}/>
            </div>
            <div 

            >

                {goldNuggets.map((item) => {  
                    
                    let percentage = 0;
                    let diggingClass;
                    let pointerevents;
 
                    if(item.digging === true){
                        const thisTime = Date.now() - item.time;
                        diggingClass = "nuggetanimation";
                        pointerevents = "none";
                        percentage = Math.round(thisTime / item.timeNeed * 100);
                        if(thisTime > item.timeNeed){

                            deleteIt(item);
                        }

                    }else{
                        diggingClass = "";
                        pointerevents = "initial";
                    }


                    return(
                            <div 
                            key={item.index} 
                            onClick={(e) => {
                                startDigging(item);
                            }}
                            
                            style={{
                                position: "absolute",
                                top: item.top,
                                left: item.left,
                                pointerEvents: pointerevents,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: "5"
                            }}
                            >
                                <Image className={"nugget" + " " + diggingClass} width={item.size} src={bitcoin}></Image>
                                <p style={{color: "white"}}>{percentage}%</p>
                            </div>
                    )
                })}

                <div
                style={{
                    //position: "absolute",
                    //top: 0,
                    zIndex: 1
                }}>
                    <svg height={fieldHeight} width={fieldWidth}>
                       {diggingPaths.map((item) => {
                        
                        let percentage;

                        if(item.digging === true){
                            const thisTime = Date.now() - item.time;

                            if(thisTime > item.timeNeed){
                                percentage = 0;
                                finishedPathFun(item)
                            }else{
                                percentage = 1 - (thisTime / item.timeNeed);
                            }
                        }
                        

                        return(
                            <line  
                                key={item.index}
                                className="textPath" 
                                style={{
                                    strokeDashoffset: percentage
                                }}
                                x1={item.x1} 
                                y1={item.y1} 
                                x2={item.x2} 
                                y2={item.y2} 
                                pathLength="1"
                            />
                        )})}

                    </svg>
                </div>
            </div>
            </div>
        </>
    )
}