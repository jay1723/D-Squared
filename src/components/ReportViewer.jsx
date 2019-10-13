import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js"; 
import _ from "lodash"; 
import useSmoothScroll from 'use-smooth-scroll';
import { Tree } from "antd";
import * as moment from "moment";

const { TreeNode } = Tree;

export default function ReportViewer(){
    const { state, dispatch } = useRootContext(); 

    let renderBottomLevel = (data) =>
        data.map(item => {
            return (
                <TreeNode title={moment(item["date"]).format("MM/DD/YYYY")} key={item["loc"]}/>
            );
    });

    let renderMidLevel = (data) =>
        Object.keys(data).map(item => {
            return (
                <TreeNode selectable={false} title={item} key={item}>
                {renderBottomLevel(data[item])}
                </TreeNode>
            );
    });

    let renderTopLevel = (data) =>
    Object.keys(data).map(item => {
        return (
            <TreeNode selectable={false} title={item} key={item}>
            {renderMidLevel(data[item])}
            </TreeNode>
        );
    });

    let onSelect = function(key){
        dispatch(['SET CURRENT FILING', key]); 
    }

    return (
        <Tree
        autoExpandParent={true} onSelect={onSelect}>
        {renderTopLevel(state.filings)}
      </Tree>
    );
}
