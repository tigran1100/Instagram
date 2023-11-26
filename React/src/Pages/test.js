import react, { useEffect, useState } from 'react'

const Test = () => {

    let [clickCount, setClickCount] = useState(0)

    useEffect(()=>{
        console.log(clickCount)

        return () => {
            console.log('Cleaned')
        }
    }, [clickCount])

    return (
        <>
            <h1 onClick={(e)=>{setClickCount(clickCount + 1)}}>Click count is: {clickCount}</h1>
        </>
    )
}

export default Test