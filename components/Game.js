import Image from 'next/image';

//local storage hook
import useLocalStorageState from 'use-local-storage-state'

//components
import GameField from "./GameField";
import { useEffect, useState } from 'react';

//pic
import bitcoin from "pic/bitcoin.svg"

export default function Game() {
    const fieldWidth = 800;
    const topOffset = 400;

    const begginGold = [
        {
            size: 50,
            top: 150 + topOffset,
            left: 200,
            radius: 10,
            digging: false,
            index: 1,
            time: null,
            timeNeed: 15000
        }, 
        {
            size: 80,
            top: 120 + topOffset,
            left: 400,
            radius: 50,
            digging: false,
            index: 2,
            time: null,
            timeNeed: 12000
        },
        {
            size: 40,
            top: 250 + topOffset,
            left: 500,
            radius: 30,
            digging: false,
            index: 3,
            time: null,
            timeNeed: 25000
        },
        {
            size: 60,
            top: 240 + topOffset,
            left: 10,
            radius: 50,
            digging: false,
            index: 4,
            time: null,
            timeNeed: 24000
        },
        {
            size: 30,
            top: 80 + topOffset,
            left: 650,
            radius: 20,
            digging: false,
            index: 5,
            time: null,
            timeNeed: 8000 
        },
        {
            size: 70,
            top: 100 + topOffset,
            left: 270,
            radius: 20,
            digging: false,
            index: 6,
            time: null,
            timeNeed: 10000 
        },
    ]

    const beginDiggingPath = {
        x1: fieldWidth / 2,
        y1: 0,
        x2: fieldWidth / 2,
        y2: 0,
        timeNeed: null,
        time: null,
        index: 1
    }
    
    //STATES
    const [count, setCount] = useState(null);
    const [gold, setGold] = useLocalStorageState("gold", {defaultValue: 100});
    const [costs, setCosts] = useLocalStorageState("costs", {defaultValue: 0});
    const [score, setScore] = useLocalStorageState("score", {defaultValue: 100});
    const [goldNuggets, setGoldNuggets] = useLocalStorageState("goldNuggets", {defaultValue: begginGold});
    const [diggingPaths, setDiggingPaths] = useLocalStorageState("diggingPaths", {defaultValue: [beginDiggingPath]});
    const [fieldScale, setFieldScale] = useState(1);

    function resetFunction() {
        setGold(100);
        setGoldNuggets(begginGold);
        setDiggingPaths([beginDiggingPath]);
        setCosts(0);
        setScore(0);
    }

    //GLOBAL INTERVAL
    useEffect(() => {
        const counting = setInterval(() => {
            setCount(Date.now());
        }, 40);
    
        return() => {
            clearInterval(counting);
        }
    }, [])
    
    useEffect(() => {
        setScore(gold - costs);

    })

    function resizeFun() {

        const windowWidth = window.innerWidth;

        if(windowWidth < fieldWidth) {
            const scale = windowWidth / (fieldWidth + 50);
            setFieldScale(scale);
            
        }else{
            setFieldScale(1);
        }

    }
    useEffect(() => {

        window.addEventListener("resize", resizeFun);
        resizeFun();

        return () => {
            window.removeEventListener("resize", resizeFun);
        }
    }, [])
    
    return(
        <>
            <div 

            className="game">

                <div 
                style={{
                    background: "rgba(60,60,60,0.95)",
                    color: "white",
                    width: "100%",
                    //maxWidth: fieldWidth,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "fixed",
                    zIndex: "50",
                    height: "60px"
                }}>
                    <div 
                    style={{
                        display: "flex",
                        flexDirection: "row", 
                        gap: "40px",
                        paddingLeft: "10px",
                        height: "100%",
                        alignItems: "center"
                    }}>
                        <div className='menucard'>
                            <Image width={30} src={bitcoin} alt='gold' title='gold'></Image>
                            <p>{gold}</p>
                        </div>
                        <div className='menucard'>
                            <p style={{paddingTop: "7px"}}><strong>COSTS</strong></p>
                            <p>{costs}</p>
                        </div>
                        <div className='menucard'>
                        <p style={{paddingTop: "7px"}}><strong>SCORE</strong></p>
                            <p>{score}</p>
                        </div>
                    </div>
                    <button 
                    className="material-symbols-outlined resetbtn" 
                    onClick={resetFunction}
                    >restart_alt</button>
                </div>
                
                <GameField 
                goldNuggets={goldNuggets} 
                setGoldNuggets={setGoldNuggets} 
                gold={gold} 
                setGold={setGold} 
                beginDiggingPath={beginDiggingPath} 
                diggingPaths={diggingPaths} 
                setDiggingPaths={setDiggingPaths} 
                fieldWidth={fieldWidth} 
                costs={costs} 
                setCosts={setCosts} 
                fieldScale={fieldScale} 
                topOffset={topOffset} 
                />

            </div>
            
        </>
    )
}