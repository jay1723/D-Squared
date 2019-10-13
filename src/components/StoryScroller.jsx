import React, { useRef, useEffect } from "react"; 
import { Card } from "antd"; 
import ReactDOM from 'react-dom'; 
import useSmoothScroll from 'use-smooth-scroll';
import { useRootContext } from "../context.js"; 

export default function StoryScroller(props) {

    // story is a sequence of objects
    const carouselRef = React.useRef(); 
    const { state, dispatch } = useRootContext(); 
    let { stories, width, ticker } = props; 

    const scrollTo = useSmoothScroll('x', carouselRef);

    useEffect(() => {

        if (state.storyScrollerProposal && 
            state.storyScrollerProposal.ticker === ticker) {

            let container = carouselRef.current; 
            let containerDims = container.getBoundingClientRect(); 
            let ithChildDims = container.children[state.storyScrollerProposal.index].getBoundingClientRect(); 
            let containerOffset = state.storyScrollerProposal.index * 198 + state.storyScrollerProposal.index * 4; 

            scrollTo(containerOffset);
            // console.log(containerOffset); 

            // After processing the current proposal, set it to an empty object as it has been processed 
            dispatch(['SET STORY SCROLLER PROPOSAL', {}]); 
        }

    }, [state.storyScrollerProposal]); 

    return <div ref={carouselRef} style={{ width, overflowX: 'scroll', display: 'flex' }}>
        {stories.map(story => 
            <div style={{ minWidth: 200, margin: 4 }}>
                <Card style={{ width: '100%', height: 160 }} title={"Story" + parseInt(Math.random() * 100)}/>
            </div>
        )}
    </div>


}