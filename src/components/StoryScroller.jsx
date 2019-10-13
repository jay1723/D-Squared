import React, { useRef, useEffect } from "react"; 
import { Card } from "antd"; 
import ReactDOM from 'react-dom'; 
import useSmoothScroll from 'use-smooth-scroll';
import _ from "lodash"; 
import { useRootContext } from "../context.js"; 
import "../css/StoryScroller.css"; 
const {Meta} = Card;

export default function StoryScroller(props) {

    // story is a sequence of objects
    const carouselRef = React.useRef(); 
    const { state, dispatch } = useRootContext(); 
    let { width, ticker } = props; 

    let stories = state.sentiments[ticker].slice(); 

    const scrollTo = useSmoothScroll('x', carouselRef);

    useEffect(() => {

        if (state.storyScrollerProposal && 
            state.storyScrollerProposal.ticker === ticker) {

            // let container = carouselRef.current; 
            // let containerDims = container.getBoundingClientRect(); 
            // let ithChildDims = container.children[state.storyScrollerProposal.index].getBoundingClientRect(); 
            let containerOffset = state.storyScrollerProposal.index * 198 + state.storyScrollerProposal.index * 4; 

            scrollTo(containerOffset);

            // After processing the current proposal, set it to an empty object as it has been processed 
            dispatch(['SET STORY SCROLLER PROPOSAL', {}]); 
        }

    }, [state.storyScrollerProposal]); 

    console.log("story ", JSON.parse(stories[0].sentiment).label);
    return <div ref={carouselRef} style={{ width, overflowX: 'scroll', display: 'flex' }}>
        {stories.map(story => 
            <div style={{ minWidth: 250, minHeight: 250, margin: 4, minHeight: 250 }}>
                <Card hoverable="true" title={<a className="title" href={story.url}>{story.title}</a>}>
                    <Meta description={story.source.name} />
                    <p className="cardDesc">{story.description}</p>
                </Card>
            </div>
        )}
    </div>


}